import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET_KEY
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Webhook error: ${error.message}`,
    });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        // ❓ Why is this needed?
        // Your metadata (transactionId, appId) was stored in Checkout Session
        // payment_intent.succeeded does NOT include metadata
        // So you:
        // Take paymentIntent.id
        // Find the Checkout Session created for it

        if (!sessionList.data.length) break;

        const session = sessionList.data[0];
        const { transactionId, appId } = session.metadata || {};

        if (appId !== "SparkGPT") {
          return res.status(200).json({
            success: true,
            message: "Ignored event: invalid app",
          });
        }

        const transaction = await Transaction.findOne({
          _id: transactionId,
          isPaid: false,
        });

        if (!transaction) break;

        await User.updateOne(
          { _id: transaction.userId },
          { $inc: { credits: transaction.credits } }
        );

        transaction.isPaid = true;
        await transaction.save();
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

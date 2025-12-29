import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Stripe from "stripe";

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

//API Controller for getting all plans

export const getPlans = async (req, res) => {
  try {
    return res.json({ success: true, plans });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

//API controller for purchasing a plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;
    const origin = req.headers.origin;
    const plan = plans.find((plan) => plan._id === planId);

    if (!plan) {
      return res.json({ status: false, message: "Invalid plan" });
    }

    //create new Transaction
    const transcation = await Transaction.create({
      userId: userId,
      planId: planId,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: {
              name: plan.name,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      metadata: {
        transcationId: transcation._id.toString(),
        appId: "SparkGPT",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, //expires in 30 Minutes
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

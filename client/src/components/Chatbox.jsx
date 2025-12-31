import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";
import axios from "axios";

const Chatbox = () => {
  const containerRef = useRef(null);

  const { theme, selectedChats, user, token, setUser, credits } =
    useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  // Load messages when chat changes
  useEffect(() => {
    if (selectedChats?.messages) {
      setMessages(selectedChats.messages);
    } else {
      setMessages([]);
    }
  }, [selectedChats]);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return toast.error("Login to use the application");
    if (!selectedChats?._id) return toast.error("Please select a chat first");

    if (credits <= 0) return toast.error("Insufficient credits");

    const promptText = prompt.trim();
    if (!promptText) return;

    try {
      setLoading(true);
      setPrompt("");

      // Optimistic UI update
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: promptText,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        {
          chatId: selectedChats._id,
          prompt: promptText,
          isPublished,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessages((prev) => [...prev, data.reply]);

      // Deduct credits
      const cost = mode === "image" ? 2 : 1;
      setUser((prev) => ({
        ...prev,
        credits: Math.max(prev.credits - cost, 0),
      }));
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
      setPrompt(promptText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Messages */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.l2 : assets.l1}
              alt="logo"
              className="w-full max-w-56 sm:max-w-68"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <Message key={message._id || message.timestamp} message={message} />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
          </div>
        )}
      </div>

      {/* Image Publish Option */}
      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="text-sm pl-3 pr-2 outline-none">
          <option className="dark:bg-orange-900" value="text">
            Text
          </option>
          <option className="dark:bg-orange-900" value="image">
            Image
          </option>
        </select>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          className="outline-none flex-1 w-full text-sm"
          disabled={loading}
          required
        />

        <button type="submit" disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="send"
            className="w-8 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;

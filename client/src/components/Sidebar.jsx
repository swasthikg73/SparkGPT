import React, { useContext, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    user,
    setSelectedChat,
    theme,
    chats,
    setTheme,
    navigate,
    setToken,
    token,
    fetchUsersChats,
    setChats,
    createNewChat,
  } = useAppContext();
  const [search, setSearch] = useState("");

  const deleteChat = async (e, chatId) => {
    try {
      e.preventDefault();
      const confirm = window.confirm("Are you sure want t delete this?");
      if (!confirm) return;

      const { data } = await axios.delete("/api/chat/delete", {
        data: { chatId },
        headers: { authorization: token },
      });

      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id === chatId));
        await fetchUsersChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5
     dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30
      border-r border-[#80609F]/30 backdrop-blur-3xl transition-all
       duration-500 max-md:absolute left-0 z-1 ${
         !isMenuOpen && "max-md:-translate-full"
       }`}>
      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt=""
        className="w-full max-w-48"
      />
      <button
        onClick={createNewChat}
        className="flex justify-center items-center w-full py-2 mt-10
      text-white bg-linear-to-r from-[#A456f7] to-[#3D81F6] text-sm
      rounded-md cursor-pointer hover:bg-linear-to-r hover:from-[#883cd8] hover:to-[#316dd4]">
        <span className="mr-2 text-xl">+</span>
        New Chat
      </button>
      {/* Search Conversations */}
      <div
        className="flex items-center gap-2 p-3 mt-4 border
       border-gray-400 dark:border-white/20 rounded-md">
        <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search conversations"
          className="text-xs placeholder:text-gray-400 outline-none"
        />
      </div>

      {/* Recent chats */}
      {chats?.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}
      <div className="h-screen flex flex-col justify-between">
        <div>
          {chats
            .filter((chat) =>
              chat.messages[0]
                ? chat.messages[0].content
                    .toLowerCase()
                    .includes(search.toLowerCase())
                : chat.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((chat) => (
              <div
                onClick={() => {
                  navigate("/");
                  setSelectedChat(chat);
                  setIsMenuOpen(false);
                }}
                key={chat._id}
                className="p-2  px-4 my-4 dark:bg-[#57317C]/10 border 
            border-gray-300 dark:border-[#80609F]/15 rounded-md 
            cursor-pointer flex justify-between group">
                <div>
                  <p className="truncate w-full">
                    {chat.messages.length > 0
                      ? chat.messages[0].content.slice(0, 32)
                      : chat.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>
                <img
                  onClick={(e) =>
                    toast.promise(deleteChat(e, chat._id), {
                      loading: "deleting...",
                    })
                  }
                  src={assets.bin_icon}
                  className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                  alt=""
                />
              </div>
            ))}
        </div>
        <div className="bottom-options">
          {/* Community Images */}
          <div
            onClick={() => {
              navigate("/community");
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-4.5 not-dark:invert"
            />

            <div className="flex flex-col text-sm">
              <p>Community Images</p>
            </div>
          </div>

          {/* Credit Purchases option */}
          <div
            onClick={() => {
              navigate("/credits");
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all">
            <img
              src={assets.diamond_icon}
              alt=""
              className="w-4.5 dark:invert"
            />
            <div className="flex flex-col text-sm">
              <p className="">Credits : {user?.credits}</p>
              <p className="text-xs text-gray-400">
                Purchase credits to use SparkGpt
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div
            className="flex items-center justify-between  p-3 mt-4 border border-gray-300
           dark:border-white/15 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <img
                src={assets.theme_icon}
                className="w-4 not-dark:invert"
                alt=""
              />
              <p>Dark Mode</p>
            </div>
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="sr-only peer"
                // sr-only - Hides the checkbox visually,  Keeps it accessible for screen readers
                // peer - Allows other elements (div, span) to change styles based on this checkbox state using peer-checked:*

                checked={theme === "dark"}
              />
              <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
              <span
                className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform
              peer-checked:translate-x-4"></span>
            </label>
          </div>

          {/* User Account */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 p-4 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
            <img
              src={assets.user_icon}
              alt=""
              className="w-7 rounded-full not-dark:invert"
            />
            <p className="flex-1 text-sm dark:text-primary truncate">
              {user ? user.name : "Login your account"}
            </p>
            {user && (
              <img
                src={assets.logout_icon}
                onClick={() => {
                  localStorage.removeItem("SparkGPTtoken");
                  setToken("");
                  navigate("/");
                }}
                className="h-5 cursor-pointer hidden
            not-dark:invert group-hover:block"
                alt=""
              />
            )}
          </div>
        </div>
      </div>
      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        alt=""
        className=" absolute w-5 h-5 top-3 right-3 cursor-pointer not-dark:invert md:hidden"
      />
    </div>
  );
};

export default Sidebar;

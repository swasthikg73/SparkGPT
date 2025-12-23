import React, { useContext, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyChats } from "../assets/assets";
import moment from "moment";

const Sidebar = () => {
  const {
    user,
    setUser,

    setChats,
    selectedChats,
    setSelectedChat,
    theme,
    setTheme,
    fetchUser,
    navigate,
  } = useAppContext();

  const chats = dummyChats;

  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-screen min-w-72 p-5 dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1">
      {/* Logo */}

      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt=""
        className="w-full max-w-48"
      />

      <button
        className="flex justify-center items-center w-full py-2 mt-10
      text-white bg-linear-to-r from-[#A456f7] to-[#3D81F6] text-sm
      rounded-md cursor-pointer">
        <span className="mr-2 text-xl">+</span>New Chat
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
      <div className="h-full flex flex-col justify-between">
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
            onClick={() => navigate("/community")}
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
            onClick={() => navigate("/credits")}
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
            className="flex items-center gap-2 p-3 mt-4 border border-gray-300
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
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

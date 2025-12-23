import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets.js";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState(null);
  const [selectedChats, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("SGPTtheme") || "light"
  );

  const fetchUser = () => {
    setUser(dummyUserData);
  };

  const fetchUsersChats = () => {
    setChats(dummyChats);
    setSelectedChat();
  };

  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      //  setChats([]);
      fetchUsersChats();

      setSelectedChat(null);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("SGPTtheme", theme);
  }, [theme]);

  useEffect(() => {
    fetchUser();
    fetchUsersChats();
  }, []);

  const value = {
    user,
    setUser,
    chats,
    setChats,
    selectedChats,
    setSelectedChat,
    theme,
    setTheme,
    fetchUser,
    navigate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

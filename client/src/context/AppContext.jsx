import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

//axios.defaults.baseURL = "http://localhost:4200";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChats, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("SGPTtheme") || "light"
  );
  const [token, setToken] = useState(
    localStorage.getItem("SparkGPTtoken") || null
  );
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoadingUser(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) return toast("login to create a new chat");
      await axios.post(
        "/api/chat/create",
        {},
        {
          headers: { authorization: token },
        }
      );
      await fetchUsersChats();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUsersChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setChats(data.chats);

        //If the user has no chats create new chat
        if (data.chats.length === 0) {
          await createNewChat();
          return fetchUsersChats();
        } else {
          setSelectedChat(data.chats[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user, token]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("SGPTtheme", theme);
  }, [theme]);

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
    createNewChat,
    loadingUser,
    fetchUsersChats,
    token,
    setToken,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

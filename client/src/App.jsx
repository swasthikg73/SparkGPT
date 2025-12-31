import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import ChatBox from "./components/Chatbox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import { useAppContext } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const { user, loadingUser } = useAppContext();
  const { pathname } = useLocation();

  if (pathname === "/loading" || loadingUser) return <Loading />;
  return (
    <>
      <Toaster position="top-right" />
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          alt=""
          className="absolute top-3 left-3 
          cursor-pointer w-8 h-8 md:hidden not-dark:invert "
          onClick={() => setIsMenuOpen(true)}
        />
      )}
      {user ? (
        <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div
          className="bg-linear-to-b from-[#242124] to-[#000000] flex
        items-center justify-center h-screen w-screen">
          {<Login />}
        </div>
      )}
    </>
  );
};

export default App;

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import ChatBox from "./components/Chatbox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { assets } from "./assets/assets";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(isMenuOpen);

  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          alt=""
          className="absolute top-3 left-3 
          cursor-pointer w-8 h-8 md:hidden not-dark:invert "
          onClick={() => setIsMenuOpen(true)}
        />
      )}
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
    </>
  );
};

export default App;

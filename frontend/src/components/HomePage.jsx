// src/components/HomePage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import tipLogo from '../assets/tip_logo.png'; // Make sure to add this logo to your assets folder

const HomePage = ({ onStartChat }) => {
  return (
    <div className="homepage-container">
      <div className="glass-card">
        <motion.div 
          className="logo-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img src={tipLogo} alt="TIP Logo" className="tip-logo" />
        </motion.div>
        
        <motion.h1 
          className="title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to <span className="highlight">Tippy</span>
        </motion.h1>
        
        <motion.p 
          className="subtitle"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Your TIP Senior High School ChatBot
        </motion.p>
        
        <motion.button 
          className="start-chat-btn"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(255, 215, 83, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartChat}
        >
          Start Chatting
        </motion.button>
      </div>
      
      <div className="background">
        <div className="gradient-circle circle-1"></div>
        <div className="gradient-circle circle-2"></div>
      </div>
    </div>
  );
};

export default HomePage;
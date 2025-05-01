// src/components/ChatHeader.jsx
import { motion } from 'framer-motion';
import tipLogo from '../assets/tip_logo.png';

const ChatHeader = ({ onExitChat }) => {
  return (
    <motion.div 
      className="chat-header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <div className="header-logo">
          <img src={tipLogo} alt="TIP Logo" className="small-logo" />
          <div className="header-title">
            <h2>Tippy</h2>
            <p>TIP SHS Q.C. ChatBot</p>
          </div>
        </div>
        
        <button 
          className="exit-btn"
          onClick={onExitChat}
        >
          <span className="material-icons">close</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
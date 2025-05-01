// src/components/ChatInput.jsx - Enhanced
import { useState } from 'react';
import { motion } from 'framer-motion';

const ChatInput = ({ userName, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <motion.div 
      className="chat-input-container"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={!userName ? "Please enter your name..." : "Type your message here..."}
          className="chat-input"
        />
        <motion.button 
          type="submit" 
          disabled={!message.trim()} // Remove the disabled variable
          className={`send-button ${!message.trim() ? 'disabled' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="material-icons">send</span>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ChatInput;
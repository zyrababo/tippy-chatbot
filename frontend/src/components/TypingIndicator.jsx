// src/components/TypingIndicator.jsx - Enhanced
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-avatar">
        <span className="material-icons">smart_toy</span>
      </div>
      <div className="typing-text">Tippy is typing</div>
      <motion.div className="typing-dots">
        <motion.span 
          animate={{ y: [0, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
        ></motion.span>
        <motion.span 
          animate={{ y: [0, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
        ></motion.span>
        <motion.span 
          animate={{ y: [0, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
        ></motion.span>
      </motion.div>
    </div>
  );
};

export default TypingIndicator;
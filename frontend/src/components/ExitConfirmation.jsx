// src/components/ExitConfirmation.jsx
import { motion } from 'framer-motion';

const ExitConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="exit-overlay">
      <motion.div 
        className="exit-dialog"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3>End Conversation?</h3>
        <p>Are you sure you want to exit this chat session?</p>
        
        <div className="exit-buttons">
          <button 
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="confirm-btn"
            onClick={onConfirm}
          >
            Exit
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExitConfirmation;
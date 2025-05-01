// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import HomePage from './components/HomePage';
import ChatHeader from './components/ChatHeader';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import ExitConfirmation from './components/ExitConfirmation';

function App() {
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartChat = () => {
    setShowChatInterface(true);
    // First message just asks for the name
    setMessages([{
      text: "Hi there! What's your name?",
      sender: 'bot'
    }]);
  };

  const handleExitChat = () => {
    setShowExitConfirmation(true);
  };

  const confirmExit = () => {
    // Reset all states
    setUserName('');
    setMessages([]);
    setSessionId('');
    setShowChatInterface(false);
    setShowExitConfirmation(false);
  };

  const cancelExit = () => {
    setShowExitConfirmation(false);
  };

  const handleNameSubmit = async (name) => {
    console.log("Setting username to:", name);
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);
    setUserName(name);
    
    // Add the user's name response
    setMessages(prevMessages => [
      ...prevMessages, 
      { text: name, sender: 'user' }
    ]);
    
    // Set typing indicator
    setIsTyping(true);
    
    // Small delay to make the interaction feel more natural
    setTimeout(() => {
      // Add Tippy's introduction after receiving the name
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          text: `Nice to meet you, ${name}! My name is Tippy. What would you like to know about the Technological Institute of the Philippines Senior High School program in Quezon City?`,
          sender: 'bot'
        }
      ]);
      setIsTyping(false);
      
      // Initialize the session with the backend silently
      try {
        fetch('http://127.0.0.1:5000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: newSessionId,
            message: name,
            name: name
          }),
        });
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    }, 1000); // 1-second delay for more natural feel
  };

  const handleSendMessage = async (message) => {
    // Check if message is "exit" or "goodbye" to trigger exit confirmation
    if (message.toLowerCase() === "exit" || message.toLowerCase() === "goodbye") {
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: message, sender: 'user' }
      ]);
      setShowExitConfirmation(true);
      return;
    }
    
    // If userName is not set, use the message as the name
    if (!userName) {
      handleNameSubmit(message);
      return;
    }
    
    // Add user message to chat
    setMessages(prevMessages => [
      ...prevMessages, 
      { text: message, sender: 'user' }
    ]);
    
    setIsTyping(true);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: message,
          name: userName
        }),
      });
      
      const data = await response.json();
      
      // Add bot response to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: data.response, sender: 'bot' }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: "Sorry, I'm having trouble connecting to my backend. Please try again later.", sender: 'bot' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app">
      {/* Enhanced background with three gradient circles */}
      <div className="app-background">
        <div className="gradient-circle circle-1"></div>
        <div className="gradient-circle circle-2"></div>
        <div className="gradient-circle circle-3"></div>
      </div>
      
      <AnimatePresence mode="wait">
        {!showChatInterface ? (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HomePage onStartChat={handleStartChat} />
          </motion.div>
        ) : (
          <motion.div 
            key="chatpage"
            className="chat-interface"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <ChatHeader onExitChat={handleExitChat} />
            
            <div className="messages-container">
              <div className="messages-list">
                {messages.map((msg, index) => (
                  <ChatBubble 
                    key={index}
                    message={msg}
                    isUser={msg.sender === 'user'}
                  />
                ))}
                
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <ChatInput 
              userName={userName}
              onSendMessage={handleSendMessage} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {showExitConfirmation && (
        <ExitConfirmation 
          onConfirm={confirmExit}
          onCancel={cancelExit}
        />
      )}
    </div>
  );
}

export default App;
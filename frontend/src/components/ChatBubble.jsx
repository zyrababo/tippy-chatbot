// Modified ChatBubble.jsx
import { motion } from 'framer-motion';

const formatMessage = (text) => {
  // Step 1: Convert [text](url) to <a> tags
  let formatted = text.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="bubble-link">$1</a>'
  );

  // Step 2: Convert **bold** and __bold__ to <strong>
  formatted = formatted
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Step 3: Convert bare URLs (not part of a link) into <a> tags
  formatted = formatted.replace(
    /(?<!["'=\]>])\b(https?:\/\/[^\s<>"')\]]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="bubble-link">$1</a>'
  );

  // Step 4: Handle bullet points and paragraphs
  const lines = formatted.split('\n');
  let inList = false;
  let result = '';

  lines.forEach((line, index) => {
    const isBullet = /^\s*[-•*]\s+/.test(line);
    const nextIsBullet = index + 1 < lines.length && /^\s*[-•*]\s+/.test(lines[index + 1]);

    if (isBullet) {
      if (!inList) {
        result += '<ul class="bubble-list">';
        inList = true;
      }
      result += `<li class="bubble-list-item">${line.replace(/^[-•*]\s+/, '')}</li>`;
      if (!nextIsBullet) {
        result += '</ul>';
        inList = false;
      }
    } else {
      if (inList) {
        result += '</ul>';
        inList = false;
      }
      if (line.trim() !== '') {
        result += `<p class="bubble-paragraph">${line.trim()}</p>`;
      }
    }
  });

  if (inList) result += '</ul>';
  return result;
};



const ChatBubble = ({ message, isUser }) => {
  const formattedText = formatMessage(message.text);

  return (
    <motion.div 
      className={`chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="bubble-content"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
      <div className="bubble-timestamp">
        {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
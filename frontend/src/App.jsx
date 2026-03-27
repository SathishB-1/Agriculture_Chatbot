import { useState, useEffect, useRef } from 'react';
import { Leaf, Send, MessageSquare, Sprout } from 'lucide-react';
import './index.css';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

function App() {
  const [history, setHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat, isLoading]);

  // Fetch initial history
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const questionText = inputValue.trim();
    setInputValue('');
    
    // Optimistic UI update
    setCurrentChat(prev => [...prev, { role: 'user', content: questionText }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setCurrentChat(prev => [...prev, { role: 'bot', content: data.chat.answer }]);
        setHistory(prev => [data.chat, ...prev].slice(0, 15));
      } else {
        setCurrentChat(prev => [...prev, { 
          role: 'bot', 
          content: `<p class="text-red-500 font-bold">Error: ${data.error}</p>`
        }]);
      }
    } catch (err) {
      setCurrentChat(prev => [...prev, { 
        role: 'bot', 
        content: `<p class="text-red-500">Network Error: Could not connect to API.</p>`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (chat) => {
    setCurrentChat([
      { role: 'user', content: chat.question },
      { role: 'bot', content: chat.answer }
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <Sprout className="header-icon" />
        <h1>Agriculture AI Assistant</h1>
      </header>

      <div className="main-content">
        {/* History Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">
            <MessageSquare size={16} /> Recent Questions
          </div>
          <div className="history-list">
            {history.length === 0 ? (
              <div className="text-sm text-center text-gray-400 mt-4">No recent questions</div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id} 
                  className="history-item"
                  onClick={() => handleHistoryClick(item)}
                >
                  <div className="history-q">{item.question}</div>
                  <div className="history-time">{item.timestamp}</div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Chat Interface */}
        <main className="chat-area">
          <div className="messages">
            {currentChat.length === 0 ? (
              <div className="welcome-screen">
                <Leaf className="welcome-icon" />
                <h2>Welcome to your virtual farm consultant.</h2>
                <p>Ask me about soil, irrigation, fertilizers, crops, and pests.</p>
              </div>
            ) : (
              currentChat.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}-message`}>
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="message bot-message">
                <div className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="input-area">
            <form onSubmit={handleSubmit} className="input-form">
              <textarea
                className="chat-input"
                placeholder="Ask about crops, fertilizers, pests..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
              />
              <button type="submit" className="send-btn" disabled={!inputValue.trim() || isLoading}>
                <Send size={20} />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

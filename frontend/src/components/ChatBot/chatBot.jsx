import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";

import api from "../../services/api";
import "./chatBot.css";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const chatBodyRef = useRef(null);

  const initialMessages = [
    {
      id: "welcome-1",
      type: "bot",
      text: "Hi! 👋 I'm WiseBot.",
    },
    {
      id: "welcome-2",
      type: "bot",
      text: "I can help you with TimeWise features, attendance, reports, settings and navigation. 😊",
    },
  ];

  const [messages, setMessages] = useState(initialMessages);

  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "How do I check my attendance?",
    "Where can I see my reports?",
    "How do I change my profile settings?",
  ];

  const handleSend = async (question = message) => {
    const trimmedMessage = question.trim();

    if (!trimmedMessage || isLoading) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: trimmedMessage,
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: response.data?.answer || "Sorry, I couldn't generate a response.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text:
          error.response?.data?.message ||
          "Sorry, something went wrong while connecting to the TimeWise Assistant.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (question) => {
    handleSend(question);
  };

  useEffect(() => {
    if (!chatBodyRef.current) return;

    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const response = await api.get("/ai/chat");

        if (
          response.data?.success &&
          Array.isArray(response.data.conversation) &&
          response.data.conversation.length > 0
        ) {
          const restoredMessages = response.data.conversation.map(
            (chatMessage, index) => ({
              id: `restored-${index}`,
              type: chatMessage.role === "user" ? "user" : "bot",
              text: chatMessage.content,
            }),
          );

          setMessages([...initialMessages, ...restoredMessages]);
        }
      } catch (error) {
        console.error("Failed to load AI conversation:", error);
      }
    };

    loadConversation();
  }, []);

  return (
    <div className={`ai_assistant ${isOpen ? "open" : ""}`}>
      {/* Chat Panel */}
      <div className="ai_chat_panel">
        {/* Header */}
        <div className="ai_chat_header">
          <div className="ai_chat_title">
            <div className="ai_header_icon">
              <Bot size={21} strokeWidth={3} />
            </div>

            <div>
              <h3>WiseBot</h3>

              <span>
                <span className="ai_online_dot"></span>
                Online
              </span>
            </div>
          </div>

          <button
            type="button"
            className="ai_close_btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close TimeWise Assistant"
          >
            <X size={19} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="ai_chat_body" ref={chatBodyRef}>
          {messages.map((chatMessage) => (
            <div
              key={chatMessage.id}
              className={`ai_message ${
                chatMessage.type === "user"
                  ? "ai_user_message"
                  : "ai_bot_message"
              }`}
            >
              {chatMessage.type === "bot" && (
                <div className="ai_message_icon">
                  <Bot size={17} />
                </div>
              )}

              <div className="ai_message_content">
                <p>{chatMessage.text}</p>
              </div>
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="ai_message ai_bot_message">
              <div className="ai_message_icon">
                <Bot size={17} />
              </div>

              <div className="ai_message_content ai_typing_message">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {messages.length <= 2 && !isLoading && (
            <div className="ai_suggestions">
              <div className="ai_suggestions_title">
                <Sparkles size={15} />
                <span>Try asking</span>
              </div>

              {suggestedQuestions.map((question) => (
                <button
                  type="button"
                  className="ai_suggestion"
                  key={question}
                  onClick={() => handleSuggestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="ai_chat_input_area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder={
              isLoading ? "WiseBot Assistant is thinking..." : "Ask WiseBot..."
            }
            aria-label="Ask TimeWise Assistant"
            disabled={isLoading}
          />

          <button
            type="button"
            className="ai_send_btn"
            onClick={() => handleSend()}
            disabled={!message.trim() || isLoading}
            aria-label="Send message"
          >
            <Send size={19} />
          </button>
        </div>
      </div>

      {/* Floating AI Button */}
      <button
        type="button"
        className="ai_assistant_btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={
          isOpen ? "Close TimeWise Assistant" : "Open TimeWise Assistant"
        }
        aria-expanded={isOpen}
      >
        <span className="ai_btn_glow"></span>

        {isOpen ? (
          <X size={25} strokeWidth={2.1} />
        ) : (
          <Bot size={25} strokeWidth={2.1} />
        )}
      </button>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import api from "../../services/api";
import "../ChatBot/chatBot.css";

export function AdminChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "bot",
      text: "Hi! I'm Admin WiseBot. Ask me about employees, attendance, leaves, or calendar events.",
    },
  ]);

  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    chatBody.scrollTo({
      top: chatBody.scrollHeight,
      behavior: "smooth",
    });
  }, [isOpen, isLoading, messages]);

  const send = async () => {
    const question = message.trim();
    if (!question || isLoading) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), type: "user", text: question },
    ]);
    setMessage("");
    setIsLoading(true);
    try {
      const { data } = await api.post("/user/admin-ai/chat", {
        message: question,
      });
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, type: "bot", text: data.answer },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          type: "bot",
          text:
            error.response?.data?.message || "Unable to reach Admin WiseBot.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai_assistant ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <section className="ai_chat_panel">
          <header className="ai_chat_header">
            <div className="ai_chat_title">
              <div className="ai_header_icon"><Bot size={19} /></div>
              <div><h3>Admin WiseBot</h3><span>Organisation assistant</span></div>
            </div>
            <button
              type="button"
              className="ai_close_btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Admin WiseBot"
            >
              <X size={18} />
            </button>
          </header>
          <div className="ai_chat_body" ref={chatBodyRef}>
            {messages.map((item) => (
              <div key={item.id} className={`ai_message ${item.type === "user" ? "ai_user_message" : "ai_bot_message"}`}>
                {item.type === "bot" && <div className="ai_message_icon"><Bot size={17} /></div>}
                <div className="ai_message_content"><p>{item.text}</p></div>
              </div>
            ))}
            {isLoading && <div className="ai_message ai_bot_message"><div className="ai_message_icon"><Bot size={17} /></div><div className="ai_message_content"><p>Thinking...</p></div></div>}
          </div>
          <div className="ai_chat_input_area">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
              placeholder="Ask Admin WiseBot..."
              disabled={isLoading}
            />
            <button
              type="button"
              className="ai_send_btn"
              onClick={send}
              disabled={isLoading || !message.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </section>
      )}
      <button
        type="button"
        className="ai_assistant_btn"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Open Admin WiseBot"
      >
        {isOpen ? <X size={23} /> : <Bot size={23} />}
      </button>
    </div>
  );
}

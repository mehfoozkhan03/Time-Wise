import { useEffect, useRef, useState } from "react";
import { Bot, Send, Trash2, X } from "lucide-react";
import api from "../../services/api";
import "../ChatBot/chatBot.css";
import { useFloatingControls } from "../../context/FloatingControlsContext";
import { Modal } from "../Modal/Modal";

const initialMessages = [
  {
    id: "welcome",
    type: "bot",
    text: "Hi! I'm Admin WiseBot. Ask me about employees, attendance, working hours, overtime, productivity, leave requests, calendar events, or the next holidays.",
  },
];

export function AdminChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConversationLoading, setIsConversationLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const chatBodyRef = useRef(null);
  const [messages, setMessages] = useState(initialMessages);
  const { hideOnIdle } = useFloatingControls();

  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    chatBody.scrollTo({
      top: chatBody.scrollHeight,
      behavior: "smooth",
    });
  }, [isOpen, isLoading, messages]);

  useEffect(() => {
    let isMounted = true;
    const loadConversation = async () => {
      try {
        const { data } = await api.get("/admin/admin-ai/chat");
        if (!isMounted || !data?.success || !Array.isArray(data.conversation)) return;

        const restoredMessages = data.conversation.map((item, index) => ({
          id: `restored-${index}`,
          type: item.role === "user" ? "user" : "bot",
          text: item.content,
        }));
        setMessages([...initialMessages, ...restoredMessages]);
      } catch (error) {
        console.error("Failed to load Admin WiseBot conversation:", error);
      } finally {
        if (isMounted) setIsConversationLoading(false);
      }
    };

    loadConversation();
    return () => {
      isMounted = false;
    };
  }, []);

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
      const { data } = await api.post("/admin/admin-ai/chat", {
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
    <>
    <div className={`ai_assistant ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <section className="ai_chat_panel">
          <header className="ai_chat_header">
            <div className="ai_chat_title">
              <div className="ai_header_icon"><Bot size={19} /></div>
              <div><h3>Admin WiseBot</h3><span>Organisation assistant</span></div>
            </div>
            <div className="ai_header_actions">
              <button
                type="button"
                className="ai_clear_btn"
                onClick={() => setShowClearModal(true)}
                aria-label="Clear Admin WiseBot conversation"
                title="Clear conversation"
                disabled={isClearing || isConversationLoading}
              >
                <Trash2 size={17} />
              </button>
              <button
                type="button"
                className="ai_close_btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Admin WiseBot"
              >
                <X size={18} />
              </button>
            </div>
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
              onKeyDown={(event) => {
                if (event.key === "Enter") send();
              }}
              placeholder="Ask Admin WiseBot..."
              disabled={isLoading || isConversationLoading}
            />
            <button
              type="button"
              className="ai_send_btn"
              onClick={send}
              disabled={isLoading || isConversationLoading || !message.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </section>
      )}
      <button
        type="button"
        className={`ai_assistant_btn ${hideOnIdle && !isOpen ? "idle_hidden" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Open Admin WiseBot"
      >
        {isOpen ? <X size={23} /> : <Bot size={23} />}
      </button>
    </div>

      <Modal
        isOpen={showClearModal}
        variant="error"
        title="Clear conversation?"
        message="This will clear your Admin WiseBot conversation and cannot be undone."
        onClose={() => {
          if (!isClearing) setShowClearModal(false);
        }}
        onConfirm={async () => {
          if (isClearing) return;
          setIsClearing(true);
          try {
            await api.delete("/admin/admin-ai/chat");
            setMessages(initialMessages);
            setMessage("");
            setShowClearModal(false);
          } catch (error) {
            setMessages((current) => [
              ...current,
              {
                id: Date.now(),
                type: "bot",
                text: error.response?.data?.message || "Unable to clear the conversation.",
              },
            ]);
            setShowClearModal(false);
          } finally {
            setIsClearing(false);
          }
        }}
        confirmText={isClearing ? "Clearing..." : "Clear"}
        cancelText="Cancel"
        showActions
      />
    </>
  );
}

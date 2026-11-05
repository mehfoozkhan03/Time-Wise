import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdArrowBack,
  MdAttachFile,
  MdCheck,
  MdMoreHoriz,
  MdOutlineHeadsetMic,
  MdSend,
  MdSupportAgent,
} from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import api from "../../../../services/api";
import "./LiveChat.css";

const initialMessages = [
  {
    id: 1,
    from: "support",
    time: "",
    text: "Hi there! Welcome to TimeWise support. How can we help you today?",
  },
];

export const LiveChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isLoading) return;

    setDraft("");
    setMessages((current) => [...current, {
      id: Date.now(),
      from: "user",
      time: new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit" }).format(new Date()),
      text,
    }]);
    setIsLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { message: text });
      setMessages((current) => [...current, {
        id: Date.now() + 1,
        from: "support",
        time: new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit" }).format(new Date()),
        text: data?.answer || "I couldn’t find an answer just now. Please try again or contact support by email.",
      }]);
    } catch (error) {
      setMessages((current) => [...current, {
        id: Date.now() + 1,
        from: "support",
        time: new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit" }).format(new Date()),
        text: error.response?.data?.message || "I couldn’t connect to TimeWise support. Please try again in a moment or contact support by email.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="liveChat-page">
      <div className="liveChat-topline">
        <Link to="/settings/help_support" className="liveChat-back">
          <MdArrowBack aria-hidden="true" />
          <span>Help &amp; Support</span>
        </Link>
          <span className="liveChat-preview-tag">TimeWise support</span>
      </div>

      <section className="liveChat-card" aria-label="Live chat with support">
        <aside className="liveChat-inbox">
          <div className="liveChat-inbox-heading">
            <div>
              <h2>Messages</h2>
              <p>Get help from our team</p>
            </div>
            <span className="liveChat-inbox-icon"><MdOutlineHeadsetMic /></span>
          </div>

          <div className="liveChat-conversation liveChat-conversation-active">
            <span className="liveChat-avatar"><MdSupportAgent /></span>
            <span className="liveChat-conversation-copy">
              <span className="liveChat-conversation-title">TimeWise Support</span>
              <span className="liveChat-conversation-snippet">We’re here to help</span>
            </span>
            <span className="liveChat-conversation-time">Now</span>
          </div>

          <div className="liveChat-hours">
            <IoMdTime aria-hidden="true" />
            <p><strong>Support hours</strong><span>Monday–Friday, 9am–6pm</span></p>
          </div>
        </aside>

        <div className="liveChat-thread">
          <header className="liveChat-thread-header">
            <span className="liveChat-avatar"><MdSupportAgent /></span>
            <div className="liveChat-agent-info">
              <h1>TimeWise Support</h1>
              <span><i /> Usually replies within a few hours</span>
            </div>
            <button type="button" className="liveChat-more" aria-label="More chat options">
              <MdMoreHoriz />
            </button>
          </header>

          <div className="liveChat-messages" aria-live="polite" ref={messagesRef}>
            <div className="liveChat-day-divider"><span>Today</span></div>
            {messages.map((message) => (
              <div className={`liveChat-message-row ${message.from === "user" ? "is-user" : "is-support"}`} key={message.id}>
                {message.from === "support" && <span className="liveChat-message-avatar"><MdSupportAgent /></span>}
                <div className="liveChat-message-content">
                  <div className="liveChat-bubble">{message.text}</div>
                  <span className="liveChat-message-time">
                    {message.time}{message.from === "user" && <MdCheck aria-label="Sent" />}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="liveChat-message-row is-support">
                <span className="liveChat-message-avatar"><MdSupportAgent /></span>
                <div className="liveChat-message-content"><div className="liveChat-bubble liveChat-typing">TimeWise support is replying<span>•••</span></div></div>
              </div>
            )}
          </div>

          <div className="liveChat-preview-note">
            Replies are provided by the TimeWise assistant. For a person, contact support by email.
          </div>
          <form className="liveChat-composer" onSubmit={sendMessage}>
            <button type="button" className="liveChat-attach" aria-label="Attach a file" title="Attachments can be connected with chat service">
              <MdAttachFile />
            </button>
            <input
              aria-label="Write a message"
              placeholder="Write your message..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={1000}
            />
            <button type="submit" className="liveChat-send" aria-label="Send message" disabled={!draft.trim() || isLoading}>
              <MdSend />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

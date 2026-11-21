import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router";
import { apiFetch } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";
import styles from "./ChatView.module.css";

function formatTime(iso) {
  return new Date(iso).toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatView() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const { conversations, refreshConversations } = useOutletContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const conversation = conversations.find((c) => c.id === Number(conversationId));
  const other = conversation?.otherUser;

  // load messages, then poll every 5 seconds
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setMessages([]);
    setError("");

    async function load() {
      try {
        const data = await apiFetch(`/conversations/${conversationId}/messages`);
        if (!ignore) setMessages(data.messages);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    const intervalId = setInterval(load, 5000);

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, [conversationId]);

  // scroll to the newest message whenever one is added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function handleSend(e) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;

    setSending(true);
    setError("");
    try {
      const data = await apiFetch(`/conversations/${conversationId}/messages`, {
        method: "POST",
        body: { body },
      });
      setMessages((prev) => [...prev, data.message]);
      setDraft("");
      refreshConversations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  // Enter sends, Shift+Enter adds a new line
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form.requestSubmit();
    }
  }

  return (
    <section className={styles.chat}>
      <header className={styles.header}>
        <Avatar user={other} size={40} />
        {other ? (
          <Link to={`/users/${other.id}`}>{other.displayName || other.username}</Link>
        ) : (
          <span>Chat</span>
        )}
      </header>

      <div className={styles.scroll}>
        {loading && <p className="note">Loading messages…</p>}
        {!loading && error && messages.length === 0 && <p className="form-error">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <p className="note">No messages yet. Say hello!</p>
        )}

        <ul className={styles.messages}>
          {messages.map((m) => {
            const mine = m.senderId === user.id;
            return (
              <li key={m.id} className={`${styles.message} ${mine ? styles.mine : styles.theirs}`}>
                <p className={styles.body}>{m.body}</p>
                <time className={styles.time} dateTime={m.createdAt}>
                  {formatTime(m.createdAt)}
                </time>
              </li>
            );
          })}
        </ul>
        <div ref={bottomRef} />
      </div>

      <form className={styles.composer} onSubmit={handleSend}>
        <textarea
          rows={2}
          placeholder="Write a message…"
          aria-label="Message"
          maxLength={2000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className={`button ${styles.send}`} disabled={sending || !draft.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}
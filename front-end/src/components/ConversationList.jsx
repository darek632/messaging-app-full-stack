import { NavLink } from "react-router";
import Avatar from "./Avatar.jsx";
import styles from "./ConversationList.module.css";

export default function ConversationList({ conversations, loading, currentUserId }) {
  if (loading) return <p className="note">Loading…</p>;

  if (conversations.length === 0) {
    return <p className="note">No chats yet. Search for someone to message.</p>;
  }

  return (
    <ul className={styles.list}>
      {conversations.map((c) => {
        const other = c.otherUser;
        const name = other ? other.displayName || other.username : "Deleted user";

        let preview = "No messages yet";
        if (c.lastMessage) {
          const prefix = c.lastMessage.senderId === currentUserId ? "You: " : "";
          preview = prefix + c.lastMessage.body;
        }

        return (
          <li key={c.id}>
            <NavLink
              to={`/chats/${c.id}`}
              className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
            >
              <Avatar user={other} size={40} />
              <div className={styles.text}>
                <span className={styles.name}>{name}</span>
                <span className={styles.preview}>{preview}</span>
              </div>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
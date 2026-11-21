import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router";
import { apiFetch, startConversation } from "../api.js";
import Avatar from "../components/Avatar.jsx";
import styles from "./SearchResults.module.css";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const navigate = useNavigate();
  const { refreshConversations } = useOutletContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startingId, setStartingId] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    const path = q ? `/users?search=${encodeURIComponent(q)}` : "/users";

    apiFetch(path)
      .then((data) => {
        if (!ignore) setUsers(data.users);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [q]);

  async function handleMessage(userId) {
    setStartingId(userId);
    try {
      const data = await startConversation(userId);
      await refreshConversations();
      navigate(`/chats/${data.conversation.id}`);
    } catch (err) {
      setError(err.message);
      setStartingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{q ? `Results for “${q}”` : "All users"}</h1>

      {error && <p className="form-error">{error}</p>}
      {loading && <p className="note">Searching…</p>}
      {!loading && users.length === 0 && <p className="note">No users found.</p>}

      {!loading && users.length > 0 && (
        <ul className={styles.results}>
          {users.map((u) => (
            <li key={u.id} className={styles.result}>
              <Avatar user={u} size={48} />
              <div className={styles.info}>
                <span className={styles.name}>{u.displayName || u.username}</span>
                <span className={styles.username}>@{u.username}</span>
              </div>
              <div className={styles.actions}>
                <Link to={`/users/${u.id}`} className="button button-outline button-small">
                  Profile
                </Link>
                <button
                  type="button"
                  className="button button-small"
                  onClick={() => handleMessage(u.id)}
                  disabled={startingId === u.id}
                >
                  {startingId === u.id ? "Opening…" : "Message"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
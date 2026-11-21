import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useSearchParams } from "react-router";
import { apiFetch } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ConversationList from "./ConversationList.jsx";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const refreshConversations = useCallback(async () => {
    try {
      const data = await apiFetch("/conversations");
      setConversations(data.conversations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  // load once, then poll every 10 seconds
  useEffect(() => {
    refreshConversations();
    const intervalId = setInterval(refreshConversations, 10000);
    return () => clearInterval(intervalId);
  }, [refreshConversations]);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <Link to="/" className={styles.logo}>
          Messages
        </Link>

        <form className={styles.search} onSubmit={handleSearch} role="search">
          <input
            type="search"
            placeholder="Search users…"
            aria-label="Search users"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="button">
            Search
          </button>
        </form>

        <nav className={styles.nav}>
          <NavLink to="/profile" className="button button-outline button-small">
            {user.username}
          </NavLink>
          <button type="button" className="button button-small" onClick={logout}>
            Log out
          </button>
        </nav>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Chats</h2>
            <Link to="/search" className="button button-small">
              New
            </Link>
          </div>
          <div className={styles.sidebarScroll}>
            <ConversationList
              conversations={conversations}
              loading={loadingConversations}
              currentUserId={user.id}
            />
          </div>
        </aside>

        <main className={styles.main}>
          <Outlet context={{ conversations, refreshConversations }} />
        </main>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useOutletContext, useParams } from "react-router";
import { apiFetch, startConversation } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import styles from "./Profile.module.css";

export default function UserProfile() {
  const { userId } = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const { refreshConversations } = useOutletContext();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let ignore = false;
    setProfile(null);
    setError("");

    apiFetch(`/users/${userId}`)
      .then((data) => {
        if (!ignore) setProfile(data.user);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  // viewing your own id? use the editable page instead
  if (Number(userId) === me.id) return <Navigate to="/profile" replace />;

  async function handleMessage() {
    setStarting(true);
    try {
      const data = await startConversation(profile.id);
      await refreshConversations();
      navigate(`/chats/${data.conversation.id}`);
    } catch (err) {
      setError(err.message);
      setStarting(false);
    }
  }

  if (error) return <div className={styles.page}><p className="form-error">{error}</p></div>;
  if (!profile) return <p className="note">Loading…</p>;

  return (
    <div className={styles.page}>
      <ProfileCard profile={profile}>
        <button type="button" className="button" onClick={handleMessage} disabled={starting}>
          {starting ? "Opening…" : "Message"}
        </button>
      </ProfileCard>
    </div>
  );
}
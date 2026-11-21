import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Logged in as {user.username}</h1>
      <button className="button" onClick={logout} style={{ marginTop: "1rem" }}>
        Log out
      </button>
    </div>
  );
}
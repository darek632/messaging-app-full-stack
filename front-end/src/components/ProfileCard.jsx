import Avatar from "./Avatar.jsx";
import styles from "./ProfileCard.module.css";

export default function ProfileCard({ profile, children }) {
  const name = profile.displayName || profile.username;
  const joined = new Date(profile.createdAt).toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <Avatar user={profile} size={88} />
        <div>
          <h1 className={styles.name}>{name}</h1>
          <span className={styles.username}>@{profile.username}</span>
        </div>
      </div>

      <p className={styles.bio}>{profile.bio || "No bio yet."}</p>

      <div className={styles.meta}>Member since {joined}</div>

      {children && <div className={styles.actions}>{children}</div>}
    </section>
  );
}
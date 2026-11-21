import { useState } from "react";
import styles from "./Avatar.module.css";

export default function Avatar({ user, size = 40 }) {
  const [failed, setFailed] = useState(false);

  const name = user?.displayName || user?.username || "?";
  const style = { width: size, height: size, fontSize: size * 0.45 };

  if (user?.avatarUrl && !failed) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className={styles.avatar}
        style={style}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={styles.avatar} style={style} aria-hidden="true">
      {name[0].toUpperCase()}
    </span>
  );
}
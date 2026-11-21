import { Link } from "react-router";
import styles from "./Welcome.module.css";

export default function Welcome() {
  return (
    <div className={styles.welcome}>
      <div className={styles.block}>
        <h2>Pick a chat or find someone new</h2>
        <p>Choose a conversation on the left, or search for a user to start messaging.</p>
        <Link to="/search" className="button">
          Browse users
        </Link>
      </div>
    </div>
  );
}
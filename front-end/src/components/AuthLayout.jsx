import styles from "./AuthLayout.module.css";

export default function AuthLayout({ title, children }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>Messages</span>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1>{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
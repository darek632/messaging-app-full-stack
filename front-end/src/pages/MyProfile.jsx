import { useEffect, useState } from "react";
import { apiFetch } from "../api.js";
import ProfileCard from "../components/ProfileCard.jsx";
import styles from "./Profile.module.css";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ displayName: "", bio: "", avatarUrl: "" });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch("/users/me")
      .then((data) => {
        setProfile(data.user);
        setForm({
          displayName: data.user.displayName ?? "",
          bio: data.user.bio ?? "",
          avatarUrl: data.user.avatarUrl ?? "",
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  function handleChange(e) {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = await apiFetch("/users/me", { method: "PATCH", body: form });
      setProfile((prev) => ({ ...prev, ...data.user }));
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!profile) return <p className="note">{error || "Loading…"}</p>;

  return (
    <div className={styles.page}>
      <ProfileCard profile={profile} />

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Edit profile</h2>

        <div className={styles.field}>
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            maxLength={50}
            value={form.displayName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={300}
            value={form.bio}
            onChange={handleChange}
          />
          <span className={styles.hint}>{form.bio.length}/300</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="avatarUrl">Avatar URL</label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            placeholder="https://…"
            value={form.avatarUrl}
            onChange={handleChange}
          />
        </div>

        {error && <div className="form-error">{error}</div>}
        {saved && <div className={styles.success}>Profile saved</div>}

        <div>
          <button type="submit" className="button" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
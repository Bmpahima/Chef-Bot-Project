import styles from "./ErrorBox.module.css";

export default function ErrorBox({ children }) {
  return (
    <div className={styles.errorBox} role="alert">
      {children}
    </div>
  );
}

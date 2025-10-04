import styles from "./GlowingButton.module.css";

export default function GlowingButton({ children, onClick, disabled, type }) {
  return (
    <button
      type={type}
      className={styles.generateBtn}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

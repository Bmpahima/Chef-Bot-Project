import { useNavigate } from "react-router-dom";

import styles from "./Welcome.module.css";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className={styles.heroCopy}>
      <h1>Chef-Bot</h1>
      <h3>Personalized Recipes. Powered by AI.</h3>
      <p>
        Chef-Bot transforms the ingredients you already have into delicious,
        tailored recipes. Snap, confirm, and cook — it’s that simple.
      </p>
      <button
        type="button"
        onClick={() => {
          navigate("/auth/signup");
        }}
      >
        Get Started →
      </button>
    </div>
  );
}

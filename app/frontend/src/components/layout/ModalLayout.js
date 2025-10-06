import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./ModalLayout.module.css";

export default function ModalLayout({ children }) {
  const navigate = useNavigate();

  const closeModal = useCallback(() => {
    navigate("..", { relative: "path", replace: true });
  }, [navigate]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeModal();
    }
    function onDown(e) {
      const card = document.getElementById("reset-card");
      if (card && !card.contains(e.target)) closeModal();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [closeModal]);
  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
    >
      <div id="reset-card" className={styles.modalCard}>
        {children}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./ImageDropdown.module.css";
import { useUser } from "../../store/userContext";

export default function ImageDropdown({ src, username = "User" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const navigate = useNavigate();
  const userCtx = useUser();

  const onLogout = () => {
    setOpen(false);
    userCtx.logout();
    navigate("/auth/login", { replace: true });
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };

    const onKey = (e) => {
      console.log(e.key);
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.navProfileWrap} ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className={styles.navProfileImg}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={"user-menu"}
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={src}
          alt="Profile Pic - User"
          className={styles.navProfileImgInner}
        />
        <span className={styles.srOnly}>Open user menu for {username}</span>
      </button>

      {open && (
        <div id="user-menu" role="menu" className={styles.profileMenu}>
          <button
            role="menuitem"
            className={styles.menuItem}
            onClick={() => {
              navigate("/app/profile");
              setOpen(false);
            }}
          >
            Profile
          </button>
          <button
            role="menuitem"
            className={styles.menuItem}
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

import { NavLink, useNavigate } from "react-router-dom";

import styles from "./NavbarBig.module.css";

export default function NavbarBig() {
  const navigate = useNavigate();

  return (
    <header>
      <nav className={styles.navbarContainer}>
        <div className={styles.logo}>
          <p
            onClick={() => {
              navigate("/app/dashboard");
            }}
          >
            Chef-Bot
          </p>
        </div>
        <p className={styles.currentPage}>Dashboard</p>
        <div className={styles.navOptions}>
          <NavLink to={() => {}}>Dashboard</NavLink>
          <NavLink to={() => {}}>Create</NavLink>
          <NavLink to={() => {}}>Recipes</NavLink>
          <NavLink to={() => {}}>Profile</NavLink>
        </div>
        <div className={styles.navProfileImg} aria-hidden="true"></div>
      </nav>
    </header>
  );
}

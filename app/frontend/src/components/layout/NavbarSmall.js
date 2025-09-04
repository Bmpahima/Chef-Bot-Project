import { NavLink } from "react-router-dom";

import styles from "./NavbarSmall.module.css";

export default function NavbarSmall() {
  return (
    <nav className={styles.navBar}>
      <NavLink to="/auth/login">Login</NavLink>
      <NavLink to="/auth/signup">Signup</NavLink>
    </nav>
  );
}

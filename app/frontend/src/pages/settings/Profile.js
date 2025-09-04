// import { NavLink, useNavigate } from "react-router-dom";

import styles from "./Profile.module.css";
import NavbarBig from "../../components/layout/NavbarBig.js";

export default function Profile() {
  return (
    <div className={styles.pageContainer}>
      <NavbarBig />
    </div>
  );
}

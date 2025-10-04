import { Outlet } from "react-router-dom";

import styles from "./LandingPage.module.css";
import NavbarSmall from "../../components/layout/NavbarSmall.js";
import BurgerImg from "../../assets/images/welcomeImg.png";

export default function LandingPage() {
  return (
    <>
      <title>Chef Bot</title>
      <div className={styles.pageContainer}>
        <div className={styles.curvedCut} aria-hidden="true" />
        <NavbarSmall />
        <section className={styles.content}>
          <Outlet />
          <div className={styles.heroImage}>
            <img src={BurgerImg} alt="Chef-Bot hero burger" />
          </div>
        </section>
      </div>
    </>
  );
}

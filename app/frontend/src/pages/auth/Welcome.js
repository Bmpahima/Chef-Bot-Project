import { useNavigate } from "react-router-dom";

import styles from "./Welcome.module.css";
import BurgerImg from "../../assets/images/welcomeImg.png";
import NavbarSmall from "../../components/NavbarSmall";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className={styles.pageContainer}>
      <div className={styles.curvedCut} aria-hidden="true"></div>

      <NavbarSmall />

      <section className={styles.content}>
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

        <div className={styles.heroImage}>
          <img src={BurgerImg} alt="Chef-Bot hero burger" />
        </div>
      </section>
    </div>
  );
}

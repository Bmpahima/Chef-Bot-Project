import { NavLink, useNavigate } from "react-router-dom";
import { AiFillFire, AiFillStar } from "react-icons/ai";
import { HiDocumentText } from "react-icons/hi";

import styles from "./Dashboard.module.css";
import NavbarBig from "../../components/NavbarBig";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <NavbarBig />
      <section className={styles.content}>
        <div className={styles.content__header}>
          <div>
            <h1>Welcome Back, Ben!</h1>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>83</span>
                <span className={styles.statLabel}>Total Recipes</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>7</span>
                <span className={styles.statLabel}>Day Streak</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.generateButton}
            onClick={() => navigate("/app/create")}
          >
            Generate Recipe
          </button>
        </div>
        <div className={styles.content__body}>
          <article className={styles.infoCard}>
            <div>
              <AiFillStar color="#388e3c" size={"1.8rem"} />
              <h3>AI Power</h3>
            </div>
            <p>
              Let Chef Bot create a new recipe that your tastebuds will love.
            </p>
          </article>
          <article className={styles.infoCard}>
            <div>
              <HiDocumentText color="#388e3c" size={"1.8rem"} />
              <h3>Recent Recipes</h3>
            </div>
            <p>View, edit and delete your previously generated recipes.</p>
          </article>
          <article className={styles.infoCard}>
            <div>
              <AiFillFire color="#388e3c" size={"1.8rem"} />
              <h3>Streak</h3>
            </div>
            <p>You are on a 7 day recipe streak. Keep the momentum going!</p>
          </article>
        </div>
        <div className={styles.content__body__recent}>
          <div className={styles.blockHead}>
            <h3>Recent Recipe</h3>
            <NavLink>View All</NavLink>
          </div>
          <div className={styles.recentList}>
            <div className={styles.recipeCard}>
              <span>Burger</span>
            </div>
            <div className={styles.recipeCard}>
              <span>Spaghetti</span>
            </div>
            <div className={styles.recipeCard}>
              <span>Sandwich</span>
            </div>
            <div className={styles.recipeCard}>
              <span>Salad</span>
            </div>
          </div>
        </div>
      </section>
      {/* <footer></footer> */}
    </div>
  );
}

import { NavLink, useNavigate } from "react-router-dom";
import { AiFillFire, AiFillStar } from "react-icons/ai";
import { HiDocumentText } from "react-icons/hi";
import { useEffect, useState } from "react";

import styles from "./Dashboard.module.css";
import NavbarBig from "../../components/layout/NavbarBig";
import { useUser } from "../../store/userContext";
import { appAPI } from "../../http/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(false);
  const userCtx = useUser();

  useEffect(() => {
    const getRecipesFromDb = async () => {
      setIsLoading(true);
      try {
        const { data } = await appAPI.get("/get-dashboard");
        if (data?.error) {
          console.error("Error:", data.error);
        } else {
          setRecipes(data.recipes);
        }
      } catch (err) {
        console.error("Request failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getRecipesFromDb();
  }, []);

  let recipesContent = undefined;

  if (isLoading) {
    recipesContent = <p>Recipes are loading...</p>;
  } else if (recipes.length === 0) {
    recipesContent = <p>You have no recipes.</p>;
  } else {
    recipesContent = recipes.map((r) => (
      <div className={styles.recipeCard}>
        <span>r.name</span>
      </div>
    ));
  }

  return (
    <div className={styles.pageContainer}>
      <NavbarBig />
      <section className={styles.content}>
        <div className={styles.content__header}>
          <div>
            <h1>Welcome Back, {userCtx.user.username}!</h1>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{recipes.length}</span>
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
            <h3>Recent Recipes</h3>
            {recipes.length > 0 && <NavLink>View All</NavLink>}
          </div>
          <div className={styles.recentList}>{recipesContent}</div>
        </div>
      </section>
      {/* <footer></footer> */}
    </div>
  );
}

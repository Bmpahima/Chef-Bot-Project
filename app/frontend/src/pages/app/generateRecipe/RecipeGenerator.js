// src/app/generateRecipe/RecipeGenerator.js
import { NavLink, Outlet } from "react-router-dom";
import NavbarBig from "../../../components/layout/NavbarBig";
import styles from "./RecipeGenerator.module.css";

export default function RecipeGenerator() {
  return (
    <div className={styles.pageContainer}>
      <NavbarBig />
      <main className={styles.container}>
        <section className={styles.header}>
          <h1>Create Recipe</h1>

          <div
            role="tablist"
            aria-label="Create recipe options"
            className={styles.actionsContainer}
          >
            <NavLink
              to="/app/create/upload"
              role="tab"
              className={({ isActive }) =>
                `${styles.optionButton} ${isActive ? styles.selected : ""}`
              }
            >
              Upload Image
            </NavLink>

            <NavLink
              to="/app/create/manual"
              role="tab"
              className={({ isActive }) =>
                `${styles.optionButton} ${isActive ? styles.selected : ""}`
              }
            >
              Manual Entry
            </NavLink>

            <NavLink
              to="/app/create/ai"
              role="tab"
              className={({ isActive }) =>
                `${styles.optionButton} ${isActive ? styles.selected : ""}`
              }
            >
              AI Suggestion
            </NavLink>
          </div>
        </section>

        <section className={styles.content}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}

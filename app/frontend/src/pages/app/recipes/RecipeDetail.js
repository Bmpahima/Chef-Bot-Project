// import { NavLink, useNavigate } from "react-router-dom";

import styles from "./RecipeDetail.module.css";
import NavbarBig from "../../../components/layout/NavbarBig.js";

export default function RecipeDetail() {
  return (
    <div className={styles.pageContainer}>
      <NavbarBig />
      <main className={styles.container}>
        <section className={styles.header}>
          <div className={styles.title}>
            <h1>Cheakpea Salad</h1>
            <div className={styles.recipeImage}></div>
          </div>
          <div className={styles.badgesContainer}>
            <span>Italian</span>
            <span>Easy</span>
            <span>Vegan</span>
            <span>Kosher</span>
          </div>
          <div className={styles.prepInfoContainer}>
            <div className={styles.prepInfo}>
              <p>Servings</p>
              <span>4</span>
            </div>
            <div className={styles.prepInfo}>
              <p>Prep Time</p>
              <span>15 min</span>
            </div>
            <div className={styles.prepInfo}>
              <p>Cook Time</p>
              <span>10 min</span>
            </div>
          </div>
          <div className={styles.confOptionsContainer}>
            <button type="button">Edit</button>
            <button type="button">Delete</button>
            <button type="button">Share</button>
          </div>
        </section>
        <section className={styles.instructionGrid}>
          <div className={styles.ingredientsContainer}>
            <h2>Ingerdients</h2>
            <ul className={styles.ingredientsList}>
              <li>400 g chickpeas</li>
              <li>200 g cherry tomatoes</li>
              <li>100 g cucumber</li>
              <li>50 g red onion</li>
              <li>50 g feta cheese</li>
              <li>2 tbsp olive oil</li>
            </ul>
          </div>
          <div className={styles.instructionsContainer}>
            <h2>Instructions</h2>
            <p>
              1. Rinse and drain the checkpeas.
              <br />
              2. Dice the cherry tomatoes, cucumber and red onion.
              <br />
              3. Combine all ingerdients in a large bowl.
              <br />
              4. Drizzle with olive oil and toss gently to combine.
            </p>
          </div>
        </section>
        <section className={styles.creditsContainer}>
          <div className={styles.creationDates}>
            <div className={styles.creation}>
              <p>Created at: </p>
              <p>04/09/2025</p>
            </div>
            <div className={styles.updation}>
              <p>Updated at: </p>
              <p>04/09/2025</p>
            </div>
          </div>
          <div className={styles.authorDetailContainer}>
            <div className={styles.authorDetails}>
              <p>Author</p>
              <strong>Ben</strong>
            </div>
            <div className={styles.authorImg}></div>
          </div>
        </section>
      </main>
    </div>
  );
}

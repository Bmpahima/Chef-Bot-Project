import styles from "./RecipePreview.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavbarBig from "../../../components/layout/NavbarBig.js";
import { useDraftRecipe } from "../../../store/recipeDraftContext.js";

// const defaultRecipe = {
//   name: "Cheakpea Salad",
//   badges: ["Italian", "Easy", "Vegan", "Kosher"],
//   servings: 4,
//   prepTime: "15 min",
//   cookTime: "10 min",
//   ingredients: [
//     { ingredientName: "cherry tomatoes", amount: 400, unit: "g" },
//     { ingredientName: "cucumber", amount: 200, unit: "g" },
//     { ingredientName: "red onion", amount: 100, unit: "g" },
//     { ingredientName: "feta cheese", amount: 50, unit: "g" },
//     { ingredientName: "chickpeas", amount: 50, unit: "g" },
//     { ingredientName: "olive oil", amount: 2, unit: "tsbp" },
//   ],
//   instruction: (
//     <p>
//       1. Rinse and drain the checkpeas.
//       <br />
//       2. Dice the cherry tomatoes, cucumber and red onion.
//       <br />
//       3. Combine all ingerdients in a large bowl.
//       <br />
//       4. Drizzle with olive oil and toss gently to combine.
//     </p>
//   ),
// };

export default function RecipePreview() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { recipe, hasDraft, saveDraftOnDB } = useDraftRecipe();

  const navigate = useNavigate();

  const onClickSave = async () => {
    try {
      setIsLoading(true);
      const result = await saveDraftOnDB();
      if (!result || result.error) {
        setErrorMsg("Failed to save recipe draft. Please try again.");
      }
      navigate("/app/recipes/all");
    } catch (error) {
      setErrorMsg("Failed to save recipe draft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  let badges = [
    ...recipe?.cuisine,
    recipe?.vegetarian && "vegetarian",
    recipe?.kosher && "kosher",
    ...recipe?.flavors,
    recipe?.difficulty,
  ];

  return (
    <div className={styles.pageContainer}>
      <NavbarBig />
      {hasDraft ? (
        <main className={styles.container}>
          <section className={styles.header}>
            <div className={styles.title}>
              <h1>{recipe.name}</h1>
            </div>
            <div className={styles.badgesContainer}>
              {badges.map((b, index) => (
                <span key={`badge-${b}-${index}`}>{b}</span>
              ))}
            </div>
            <div className={styles.prepInfoContainer}>
              <div className={styles.prepInfo}>
                <p>Servings</p>
                <span>{recipe.servings}</span>
              </div>
              <div className={styles.prepInfo}>
                <p>Prep Time</p>
                <span>{recipe.prepTime}</span>
              </div>
              <div className={styles.prepInfo}>
                <p>Cook Time</p>
                <span>{recipe.cookTime}</span>
              </div>
            </div>
          </section>
          <section className={styles.instructionGrid}>
            <div className={styles.ingredientsContainer}>
              <h2>Ingerdients</h2>
              <ul className={styles.ingredientsList}>
                {recipe.ingredients.map((ing, index) => (
                  <li
                    key={`ing-${ing}-${index}`}
                  >{`${ing.amount} ${ing.unit} ${ing.ingredientName}`}</li>
                ))}
              </ul>
            </div>
            <div className={styles.instructionsContainer}>
              <h2>Instructions</h2>
              <p>{recipe.instructions}</p>
            </div>
          </section>
          {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}
          <section className={styles.optionBtns}>
            <button type="button" disabled={isLoading}>
              Regenerate
            </button>
            <button type="button" disabled={isLoading} onClick={onClickSave}>
              Save
            </button>
            <button type="button" disabled={isLoading}>
              Cancel
            </button>
          </section>
        </main>
      ) : (
        <p style={{ color: "crimson" }}>No recipe is saved.</p>
      )}
    </div>
  );
}

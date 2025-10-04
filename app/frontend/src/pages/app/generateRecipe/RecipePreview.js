import styles from "./RecipePreview.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavbarBig from "../../../components/layout/NavbarBig.js";
import { useDraftRecipe } from "../../../store/recipeDraftContext.js";
import ErrorMessage from "../../../components/UI/ErrorMessage.js";

export default function RecipePreview() {
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { recipe, hasDraft, saveDraftOnDB, clearDraft } = useDraftRecipe();

  const navigate = useNavigate();

  const onClickSave = async () => {
    try {
      setIsSaveLoading(true);
      const result = await saveDraftOnDB();
      if (!result || result.error) {
        setErrorMsg("Failed to save recipe draft. Please try again.");
      }
      navigate("/app/recipes/all");
    } catch (error) {
      setErrorMsg("Failed to save recipe draft. Please try again.");
    } finally {
      setIsSaveLoading(false);
    }
  };

  const onClickRegenrate = async () => {
    clearDraft();
    navigate("/app/create");
  };

  const onClickCancel = async () => {
    clearDraft();
    navigate("/app/dashboard");
  };

  let badges = [
    ...recipe?.cuisine,
    recipe?.vegetarian && "vegetarian",
    recipe?.kosher && "kosher",
    ...recipe?.flavors,
    recipe?.difficulty,
  ]
    .filter(Boolean)
    .map((b) => b.trim());

  return (
    <>
      <title>Recipe Preview</title>
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
            {errorMsg && <ErrorMessage message={errorMsg} />}
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

            <section className={styles.optionBtns}>
              <button
                type="button"
                disabled={isSaveLoading}
                onClick={onClickRegenrate}
              >
                Regenerate
              </button>
              <button
                type="button"
                disabled={isSaveLoading}
                onClick={onClickSave}
              >
                {isSaveLoading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                disabled={isSaveLoading}
                onClick={onClickCancel}
              >
                Cancel
              </button>
            </section>
          </main>
        ) : (
          <ErrorMessage message={"No recipe is saved."} />
        )}
      </div>
    </>
  );
}

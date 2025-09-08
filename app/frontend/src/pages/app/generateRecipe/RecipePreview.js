import styles from "./RecipePreview.module.css";
import NavbarBig from "../../../components/layout/NavbarBig.js";

const defaultRecipe = {
  name: "Cheakpea Salad",
  badges: ["Italian", "Easy", "Vegan", "Kosher"],
  servings: 4,
  prepTime: "15 min",
  cookTime: "10 min",
  ingredients: [
    { ingredientName: "cherry tomatoes", amount: 400, unit: "g" },
    { ingredientName: "cucumber", amount: 200, unit: "g" },
    { ingredientName: "red onion", amount: 100, unit: "g" },
    { ingredientName: "feta cheese", amount: 50, unit: "g" },
    { ingredientName: "chickpeas", amount: 50, unit: "g" },
    { ingredientName: "olive oil", amount: 2, unit: "tsbp" },
  ],
  instruction: (
    <p>
      1. Rinse and drain the checkpeas.
      <br />
      2. Dice the cherry tomatoes, cucumber and red onion.
      <br />
      3. Combine all ingerdients in a large bowl.
      <br />
      4. Drizzle with olive oil and toss gently to combine.
    </p>
  ),
};

export default function RecipePreview({ recipe = defaultRecipe }) {
  return (
    <div className={styles.pageContainer}>
      <NavbarBig />
      <main className={styles.container}>
        <section className={styles.header}>
          <div className={styles.title}>
            <h1>{recipe.name}</h1>
            <div className={styles.recipeImage}></div>
          </div>
          <div className={styles.badgesContainer}>
            {recipe.badges.map((b) => (
              <span>{b}</span>
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
              {recipe.ingredients.map((ing) => (
                <li>{`${ing.amount} ${ing.unit} ${ing.ingredientName}`}</li>
              ))}
            </ul>
          </div>
          <div className={styles.instructionsContainer}>
            <h2>Instructions</h2>
            {recipe.instruction}
          </div>
        </section>
        <section className={styles.optionBtns}>
          <button type="button">Regenerate</button>
          <button type="button">Save</button>
          <button type="button">Cancel</button>
        </section>
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./RecipeDetail.module.css";
import NavbarBig from "../../../components/layout/NavbarBig.js";
import { useUser } from "../../../store/userContext.js";
import { appAPI } from "../../../http/api.js";

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
  instructions: (
    <span>
      1. Rinse and drain the checkpeas.
      <br />
      2. Dice the cherry tomatoes, cucumber and red onion.
      <br />
      3. Combine all ingerdients in a large bowl.
      <br />
      4. Drizzle with olive oil and toss gently to combine.
    </span>
  ),
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState(defaultRecipe);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const userCtx = useUser();

  const { id } = useParams();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDay() + 1 || "1";
    const month = MONTHS[date.getMonth()] || "January";
    const year = date.getFullYear() || "2025";
    return `${month} ${day}, ${year}`;
  };

  useEffect(() => {
    try {
      const fetchRecipeFromDB = async () => {
        setLoading(true);
        const { data } = await appAPI.get(`/get-recipe/${id}`);
        console.log(data);
        if (data?.error) {
          throw new Error(
            "Failed to fetch recipe. please try again later." + data.error
          );
        }
        if (!data || !data.recipe) {
          console.log("No recipe has been found.");
          throw new Error("No recipe has been found.");
        }
        setRecipe(data.recipe);
        console.log(data);
      };
      fetchRecipeFromDB();
    } catch (error) {
      setErrorMsg(error.message || "Failed to fetch recipe.");
    } finally {
      setLoading(false);
    }
  }, [id]);

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
            {recipe.badges.map((b, index) => (
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
          <div className={styles.confOptionsContainer}>
            <button type="button" disabled={loading}>
              Edit
            </button>
            <button type="button" disabled={loading}>
              Delete
            </button>
            <button type="button" disabled={loading}>
              Share
            </button>
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
        <section className={styles.creditsContainer}>
          <div className={styles.creationDates}>
            <div className={styles.creation}>
              <p>Created at: </p>
              <p>{formatDate(recipe.createdAt) ?? "01/01/2025"}</p>
            </div>
            <div className={styles.updation}>
              <p>Updated at: </p>
              <p>{formatDate(recipe.updatedAt) ?? "01/01/2025"}</p>
            </div>
          </div>
          <div className={styles.authorDetailContainer}>
            <div className={styles.authorDetails}>
              <p>Author</p>
              <strong>{userCtx.user.username ?? "Unknown"}</strong>
            </div>
            <div className={styles.authorImg}></div>
          </div>
        </section>
      </main>
    </div>
  );
}

import { useSearchParams } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

import styles from "./RecipesPage.module.css";
import NavbarBig from "../../../components/layout/NavbarBig.js";
import DUMMY from "../../../data/data.js";
import RecipeCard from "../../../components/data-display/RecipeCard.js";
import { useEffect, useState } from "react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // useEffect(() => {
  //   const fetchRecipesPerPage = () => {
  //     const {data} =
  //   }
  // }, [])

  return (
    <div className={styles.pageContainer}>
      <NavbarBig />
      <main className={styles.container}>
        <section className={styles.header}>
          <h1>Your Recipes</h1>
          <div className={styles.actionsContainer}>
            <div className={styles.genButton}>
              <button>Generate Recipe</button>
            </div>
            <div>
              <span>Filter</span>
            </div>
            <div>
              <span>Sort: Recent</span>
            </div>
          </div>
        </section>
        <section className={styles.recipeGrid}>
          {DUMMY.map((recipe) => (
            <RecipeCard
              key={recipe._id.toString()}
              id={recipe._id}
              name={recipe.name}
              imageUrl={null}
              difficulty={recipe.difficulty}
              badges={[
                recipe.vegetarian && "vegetarian",
                recipe.kosher && "kosher",
                recipe.cuisine !== "other" && recipe.cuisine,
              ]}
              update={new Date(recipe.updatedAt).toDateString()}
            />
          ))}
        </section>
        <section className={styles.pageSelector}>
          <p>Showing 9 results - Page 1</p>
          <div className={styles.paginationContainer}>
            <button type="button">
              <AiOutlineArrowLeft size={"20px"} color={"#fff"} />
            </button>
            <p>1</p>
            <button type="button">
              <AiOutlineArrowRight size={"20px"} color={"#fff"} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

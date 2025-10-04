import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useRouteLoaderData,
  useNavigation,
} from "react-router-dom";

import styles from "./RecipeDetail.module.css";
import NavbarBig from "../../../components/layout/NavbarBig.js";
import { useUser } from "../../../store/userContext.js";
import { appAPI } from "../../../http/api.js";
import ErrorMessage from "../../../components/UI/ErrorMessage.js";
import { defaultRecipe } from "../../../data/data.js";
import { MONTHS } from "../../../data/constants.js";

export default function RecipeDetail() {
  const loaderData = useRouteLoaderData("recipe");
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState(() => loaderData.recipe);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const userCtx = useUser();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (loaderData && loaderData.ok) {
      setRecipe(loaderData.recipe);
    } else {
      setRecipe(defaultRecipe);
      setErrorMsg(
        recipe.error || "Failed to fetch recipe. please try again later."
      );
    }
  }, [loaderData, recipe.error]);

  // let recipe = defaultRecipe;

  let loading = navigation.state === "loading";

  const onEdit = () => {
    console.log("Edit Mode");
    navigate("edit");
  };

  const onDelete = async () => {
    if (!id) return;

    try {
      setDeleteLoading(true);
      const sure = window.confirm(
        `Are you sure you want to delete this recipe ?`
      );
      if (!sure) return;
      const { data } = await appAPI.delete(`/delete-recipe/${id}`);

      if (!data || data.error) {
        throw new Error(
          data?.error || "Failed to delete this recipe. Please try again later."
        );
      }
      navigate("/app/recipes/all");
    } catch (error) {
      setErrorMsg(
        error.response?.data ||
          error.message ||
          "Failed to delete this recipe. Please try again later."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const onShare = () => {
    console.log("Clicked Share");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate() + 1 || "1";
    const month = MONTHS[date.getMonth()] || "January";
    const year = date.getFullYear() || "2025";
    return `${month} ${day}, ${year}`;
  };

  return (
    <>
      <title>{recipe.name || "Chef Bot - Recipe"}</title>
      <div className={styles.pageContainer}>
        <NavbarBig />
        <main className={styles.container}>
          <section className={styles.header}>
            <div className={styles.title}>
              <h1>{recipe.name}</h1>
              <div className={styles.imgContainer}>
                {recipe ? (
                  <img src={`${recipe.imageUrl}`} alt={recipe.name} />
                ) : (
                  <div className={styles.noImage}></div>
                )}
              </div>
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
                <span>{recipe.prepTimeMinutes}</span>
              </div>
              <div className={styles.prepInfo}>
                <p>Cook Time</p>
                <span>{recipe.cookTimeMinutes}</span>
              </div>
            </div>
            <div className={styles.confOptionsContainer}>
              <button type="button" disabled={loading} onClick={onEdit}>
                Edit
              </button>
              <button type="button" disabled={loading} onClick={onDelete}>
                {!deleteLoading ? "Delete" : "Deleting..."}
              </button>
              <button type="button" disabled={loading} onClick={onShare}>
                Share
              </button>
            </div>
            {errorMsg !== "" && <ErrorMessage message={errorMsg} />}
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
              <div className={styles.authorImg}>
                <img src={userCtx.user.profileImg} alt="Author Profile" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export async function loader({ params }) {
  const { id } = params;
  try {
    const { data } = await appAPI.get(`/get-recipe/${id}`);

    if (!data) {
      throw new Error("No recipe has been found.");
    }

    if (data?.error) {
      throw new Error(
        "Failed to fetch recipe. please try again later." + data.error
      );
    }

    return {
      recipe: data.recipe,
      ok: true,
    };
  } catch (err) {
    return {
      error: err.message || "Failed to fetch recipe. please try again later.",
      ok: false,
    };
  }
}

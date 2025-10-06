import { useRouteLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PiChefHatFill } from "react-icons/pi";
import { FiX } from "react-icons/fi";

import ModalLayout from "../../../components/layout/ModalLayout";
import styles from "./RecipeImageModal.module.css";

export default function RecipeImageModal() {
  const navigate = useNavigate();

  const loaderData = useRouteLoaderData("recipe");
  const [recipe, setRecipe] = useState(() => loaderData.recipe);

  useEffect(() => {
    if (loaderData && loaderData.ok) {
      setRecipe(loaderData.recipe);
    }
  }, [loaderData, recipe.error]);

  return (
    <ModalLayout>
      <div className={styles.modalHeader}>
        <div className={styles.iconContainer} aria-hidden="true">
          <PiChefHatFill size={22} color="#fff" />
        </div>
        <h1 id="reset-title">{recipe?.name ? recipe.name : "Recipe Image"}</h1>
      </div>
      <div className={styles.imageContainer}>
        {recipe ? (
          <img src={`${recipe.imageUrl}`} alt={recipe.name} />
        ) : (
          <p className={styles.noImage}>Image is not available.</p>
        )}
      </div>
      <div className={styles.modalActions}>
        {/* <button type="button" className={styles.downloadBtn}>
          Download
        </button> */}
        <button
          className={styles.cancelBtn}
          onClick={() => {
            navigate("..", { relative: "path", replace: true });
          }}
        >
          Cancel
        </button>
      </div>
      <button
        type="button"
        className={styles.closeContainer}
        aria-label="Close recipe image modal"
        onClick={() => {
          navigate("..", { relative: "path", replace: true });
        }}
      >
        <FiX className={styles.XIcon} />
      </button>
    </ModalLayout>
  );
}

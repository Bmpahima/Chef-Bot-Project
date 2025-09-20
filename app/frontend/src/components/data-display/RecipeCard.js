import styles from "./RecipeCard.module.css";

import { useNavigate } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const onCardClick = () => {
    navigate(`/app/recipes/${recipe?.id}`);
  };

  return (
    <div className={styles.cardContainer} onClick={onCardClick}>
      <div className={styles.imgContainer}>
        {recipe ? (
          <img src={`${recipe.imageUrl}`} alt={recipe.name} />
        ) : (
          <div className={styles.noImage}></div>
        )}
      </div>
      <div className={styles.textContainer}>
        <h3>{recipe.name}</h3>
        <h5>{recipe.difficulty}</h5>
        <div className={styles.badgesContainer}>
          {recipe.badges.slice(0, 4).map((badge) => {
            if (!badge) return undefined;
            return (
              <p key={`${badge}`} className={styles.badge}>
                {badge}
              </p>
            );
          })}
        </div>
        <p className={styles.updateData}>
          Updated {new Date(recipe.updatedAt).toDateString()}
        </p>
      </div>
    </div>
  );
}

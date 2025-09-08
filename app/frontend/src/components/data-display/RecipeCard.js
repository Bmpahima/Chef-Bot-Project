import styles from "./RecipeCard.module.css";

export default function RecipeCard({
  id,
  name,
  imageUrl,
  difficulty,
  badges,
  update,
}) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imgContainer}>
        {imageUrl ? (
          <img src={`${imageUrl}`} alt={name} />
        ) : (
          <div className={styles.noImage}></div>
        )}
      </div>
      <div className={styles.textContainer}>
        <h3>{name}</h3>
        <h5>{difficulty}</h5>
        <div className={styles.badgesContainer}>
          {badges.map((badge) => {
            if (!badge) return undefined;
            return (
              <p key={`${badge}`} className={styles.badge}>
                {badge}
              </p>
            );
          })}
        </div>
        <p className={styles.updateData}>Updated {update}</p>
      </div>
    </div>
  );
}

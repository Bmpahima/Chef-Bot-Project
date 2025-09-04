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
          {badges.map((badge) => (
            <p className={styles.badge}>{badge}</p>
          ))}
        </div>
        <p className={styles.updateData}>{update}</p>
      </div>
    </div>
  );
}

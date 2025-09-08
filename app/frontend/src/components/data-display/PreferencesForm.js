import styles from "./PreferencesForm.module.css";
import {
  COOK_TIME_MAX,
  COOK_TIME_MIN,
  CUISINE_OPTIONS,
  DIET_TOGGLES,
  DIFFICULTY_OPTIONS,
  FLAVOR_OPTIONS,
  PREP_TIME_MAX,
  PREP_TIME_MIN,
  SERVINGS_MAX,
  SERVINGS_MIN,
} from "../../data/constants.js";

export default function PreferencesForm({
  columns = 3,
  preferences,
  setPreferences,
}) {
  const onPreferencesChange = (event) => {
    try {
      const { name, value, checked } = event.target;

      setPreferences((prev) => {
        switch (name) {
          case "cuisine":
            const cuisine = !checked
              ? prev.cuisine.filter((v) => v !== value)
              : [...prev.cuisine, value];
            return { ...prev, cuisine: cuisine };
          case "difficulty":
            return { ...prev, difficulty: value };
          case "servings":
            return { ...prev, servings: +value };
          case "diet":
            const diet = !checked
              ? prev.diet.filter((v) => v !== value)
              : [...prev.diet, value];
            return { ...prev, diet: diet };
          case "flavors":
            const flavors = prev.flavors.includes(value)
              ? prev.flavors.filter((v) => v !== value)
              : [...prev.flavors, value];
            return { ...prev, flavors: flavors };
          case "prepTimeMinutes":
            return { ...prev, prepTimeMinutes: +value };
          case "cookTimeMinutes":
            return { ...prev, cookTimeMinutes: +value };
          default:
            return prev;
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  let className =
    columns === 2
      ? styles.prefForm2
      : columns === 1
      ? styles.prefForm1
      : styles.prefForm3;

  return (
    <form className={className}>
      <fieldset className={styles.cuisineContainer}>
        <legend>Cuisine</legend>
        <div>
          {CUISINE_OPTIONS.map((cuisine) => (
            <label
              key={cuisine.value}
              htmlFor={`cuisine-${cuisine.value}`}
              style={{ display: "block" }}
            >
              <input
                type="checkbox"
                checked={preferences.cuisine.includes(cuisine.value)}
                name="cuisine"
                value={cuisine.value}
                onChange={onPreferencesChange}
                id={`cuisine-${cuisine.value}`}
              />
              {cuisine.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.weightContainer}>
        <div className={styles.diffContainer}>
          <label>Difficulty</label>
          <div>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                name="difficulty"
                value={opt.value}
                onClick={onPreferencesChange}
                className={styles.diffBtn}
                style={
                  preferences.difficulty === opt.value
                    ? { background: opt.color, color: "#000" }
                    : undefined
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.servingsContainer}>
          <label htmlFor="servings">Servings</label>
          <div>
            <input
              type="number"
              min={SERVINGS_MIN}
              max={SERVINGS_MAX}
              value={preferences.servings}
              name="servings"
              onChange={onPreferencesChange}
              id="servings"
            />
          </div>
        </div>
      </div>

      <fieldset className={styles.dietsContainer}>
        <legend>Diets</legend>
        <div>
          {DIET_TOGGLES.map((diet) => (
            <label
              htmlFor={`diet-${diet.key}`}
              key={diet.label}
              style={{ display: "block" }}
            >
              <input
                key={diet.label}
                type="checkbox"
                checked={preferences.diet.includes(diet.key)}
                name="diet"
                value={diet.key}
                onChange={onPreferencesChange}
                id={`diet-${diet.key}`}
              />
              {diet.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.flavorsContainer}>
        <label>Flavor</label>
        <div>
          {FLAVOR_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={styles.flavorBtn}
              style={
                preferences.flavors.includes(opt.value)
                  ? { background: opt.color }
                  : {}
              }
              name="flavors"
              value={opt.value}
              onClick={onPreferencesChange}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.timesContainer}>
        <div>
          <label htmlFor="prepTimeMinutes">
            Preperation Time
            <span className={styles.minutesLabel}>{" (min)"}</span>
          </label>
          <input
            type="number"
            min={PREP_TIME_MIN}
            max={PREP_TIME_MAX}
            value={preferences.prepTimeMinutes}
            name="prepTimeMinutes"
            id="prepTimeMinutes"
            onChange={onPreferencesChange}
          />
        </div>
        <div>
          <label htmlFor="cookTimeMinutes">
            Cook Time<span className={styles.minutesLabel}>{" (min)"}</span>
          </label>
          <input
            type="number"
            min={COOK_TIME_MIN}
            max={COOK_TIME_MAX}
            value={preferences.cookTimeMinutes}
            name="cookTimeMinutes"
            id="cookTimeMinutes"
            onChange={onPreferencesChange}
          />
        </div>
      </div>
    </form>
  );
}

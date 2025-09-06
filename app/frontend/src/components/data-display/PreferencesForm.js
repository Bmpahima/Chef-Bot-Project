import { useState } from "react";

import styles from "./PreferencesForm.module.css";
import {
  COOK_TIME_MAX,
  COOK_TIME_MIN,
  CUISINE_OPTIONS,
  DIET_TOGGLES,
  DIFFICULTY_OPTIONS,
  FLAVOR_OPTIONS,
  INITIAL_CONSTRAINTS,
  PREP_TIME_MAX,
  PREP_TIME_MIN,
  SERVINGS_MAX,
  SERVINGS_MIN,
} from "../../data/constants.js";

export default function PreferencesForm() {
  const [preferences, setPreferences] = useState(INITIAL_CONSTRAINTS);

  const onPreferencesChange = (name, value) => {};

  return (
    <form className={styles.prefForm}>
      <div className={styles.cuisineContainer}>
        <legend>Cuisine</legend>
        <div>
          {CUISINE_OPTIONS.map((cuisine) => (
            <label key={cuisine.value} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={preferences.cuisine.includes(cuisine.value)}
              />
              {cuisine.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.weightContainer}>
        <div className={styles.diffContainer}>
          <label htmlFor="diff">Difficulty</label>
          <div>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.label}
                className={styles.diffBtn}
                style={
                  preferences.difficulty === opt.value
                    ? { background: opt.color, color: "#000" }
                    : {}
                }
              >
                {opt.value}
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
              id="servings"
            />
          </div>
        </div>
      </div>

      <div className={styles.dietsContainer}>
        <legend>Diets</legend>
        <div>
          {DIET_TOGGLES.map((diet) => (
            <label key={diet.value} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={preferences.diet.includes(diet.key)}
              />
              {diet.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.flavorsContainer}>
        <label htmlFor="flavors">Flavor</label>
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
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.timesContainer}>
        <div>
          <label htmlFor="prepTime">Preperation Time</label>
          <input
            type="number"
            min={PREP_TIME_MIN}
            max={PREP_TIME_MAX}
            value={preferences.prepTimeMinutes}
            name="prepTime"
            id="prepTime"
          />
        </div>
        <div>
          <label htmlFor="cookTime">Cook Time</label>
          <input
            type="number"
            min={COOK_TIME_MIN}
            max={COOK_TIME_MAX}
            value={preferences.cookTimeMinutes}
            name="cookTime"
            id="cookTome"
          />
        </div>
      </div>
    </form>
  );
}

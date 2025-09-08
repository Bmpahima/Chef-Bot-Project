import styles from "./ManualEntry.module.css";
import { useState } from "react";

import IngredientItem from "../../../../components/data-display/IngredientItem";
import PreferencesForm from "../../../../components/data-display/PreferencesForm";
import { INITIAL_CONSTRAINTS } from "../../../../data/constants.js";
import { appAPI } from "../../../../http/api.js";

export default function ManualEntry() {
  const [ingredients, setIngredients] = useState([""]);
  const [preferences, setPreferences] = useState(INITIAL_CONSTRAINTS);
  const [isGenLoading, setIsGenLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onAddIngManual = () => {
    if (ingredients.length >= 20) return;
    setIngredients((prev) => [...prev, ""]);
  };

  const onIngChangeHandler = (index, event) => {
    const { value } = event.target;
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const onClearIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const onGenerate = async () => {
    try {
      setIsGenLoading(true);
      const { data } = await appAPI.post("/manual-generate", {
        ingredients: ingredients.filter((i) => i !== ""),
        constraints: preferences,
      });
      if (data?.error) {
        setErrors((prev) => ({
          ...prev,
          generateError: "Error in Generating Recipe: " + data.error.message,
        }));
        setIsGenLoading(false);
        return;
      }

      console.log(data.recipe);
      setIsGenLoading(false);
      return;
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        generateError: "Error in Generating Recipe: " + error.message,
      }));
      setIsGenLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.detectedIng}>
          <h2>
            Ingredients <span> (editable)</span>
          </h2>
          <form className={styles.ingList}>
            {ingredients.map((value, index) => (
              <IngredientItem
                key={index}
                text={value}
                onChange={(e) => onIngChangeHandler(index, e)}
                onClear={() => onClearIngredient(index)}
              />
            ))}
          </form>
          <div className={styles.addContainer}>
            <button
              type="button"
              onClick={onAddIngManual}
              className={styles.addButton}
            >
              add
            </button>
          </div>
        </div>
        <div className={styles.prefContainer}>
          <h2>Preferences & constraints</h2>
          <PreferencesForm
            columns={2}
            preferences={preferences}
            setPreferences={setPreferences}
          />
        </div>
      </div>
      <div className={styles.submittion}>
        <button
          type="button"
          className={styles.generateBtn}
          onClick={onGenerate}
          disabled={isGenLoading}
        >
          {isGenLoading ? "Generating a Recipe..." : "Generate"}
        </button>
      </div>
    </>
  );
}

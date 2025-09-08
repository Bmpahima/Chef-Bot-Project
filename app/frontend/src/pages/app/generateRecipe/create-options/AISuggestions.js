import styles from "./AISuggestions.module.css";
import { useState } from "react";

import PreferencesForm from "../../../../components/data-display/PreferencesForm";
import { INITIAL_CONSTRAINTS } from "../../../../data/constants.js";
import { appAPI } from "../../../../http/api.js";

export default function AISuggestions() {
  const [preferences, setPreferences] = useState(INITIAL_CONSTRAINTS);
  const [isGenLoading, setIsGenLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onGenerate = async () => {
    try {
      setIsGenLoading(true);
      const { data } = await appAPI.post("/ai-generate", {
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
        <div className={styles.prefContainer}>
          <h2>Preferences & constraints</h2>
          <PreferencesForm
            columns={3}
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

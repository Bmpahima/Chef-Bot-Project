import styles from "./AISuggestions.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PreferencesForm from "../../../../components/data-display/PreferencesForm";
import { INITIAL_CONSTRAINTS } from "../../../../data/constants.js";
import { appAPI } from "../../../../http/api.js";
import { useDraftRecipe } from "../../../../store/recipeDraftContext.js";

export default function AISuggestions() {
  const [preferences, setPreferences] = useState(INITIAL_CONSTRAINTS);
  const [isGenLoading, setIsGenLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const draftCtx = useDraftRecipe();
  const navigate = useNavigate();

  const onGenerate = async () => {
    try {
      setIsGenLoading(true);
      const { data } = await appAPI.post("/ai-generate", {
        constraints: preferences,
      });
      if (data?.error) {
        setErrorMsg("Error in Generating Recipe: " + data.error);
        return;
      }

      console.log(data.recipe);
      draftCtx.saveDraft(data.recipe);
      navigate("/app/preview");
    } catch (error) {
      setErrorMsg("Error in Generating Recipe: " + error.message);
    } finally {
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

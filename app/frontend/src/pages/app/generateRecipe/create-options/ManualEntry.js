import styles from "./ManualEntry.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import IngredientItem from "../../../../components/data-display/IngredientItem";
import PreferencesForm from "../../../../components/data-display/PreferencesForm";
import { INITIAL_CONSTRAINTS } from "../../../../data/constants.js";
import { appAPI } from "../../../../http/api.js";
import { useDraftRecipe } from "../../../../store/recipeDraftContext.js";
import ErrorMessage from "../../../../components/UI/ErrorMessage.js";
import ErrorBox from "../../../../components/UI/ErrorBox.js";
import GlowingButton from "../../../../components/UI/GlowingButton.js";
import { useUser } from "../../../../store/userContext.js";

export default function ManualEntry() {
  const [ingredients, setIngredients] = useState([""]);
  const userCtx = useUser();
  const [preferences, setPreferences] = useState({
    ...INITIAL_CONSTRAINTS,
    ...userCtx.user.defaultPreferences,
  });
  const [isGenLoading, setIsGenLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [validationErrors, setValidationErrors] = useState([]);

  const draftCtx = useDraftRecipe();
  const navigate = useNavigate();

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
      setErrorMsg("");
      setValidationErrors([]);
      const { data } = await appAPI.post("/manual-generate", {
        ingredients: ingredients.filter((i) => i !== ""),
        constraints: preferences,
      });
      if (data?.error) {
        setErrorMsg("Error in Generating Recipe: " + data.error);
        return;
      }
      draftCtx.saveDraft(data.recipe);
      navigate("/app/preview");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErrorMsg("Network error. Please try again.");
          return;
        }
        const { status, data } = err.response;
        console.log(status, data);

        if (status === 422) {
          const list = data?.errors ?? data?.validationsErrors ?? [];
          const msgs = list.map((e) => e.msg || e.message || String(e));
          setValidationErrors(msgs);
          return;
        }

        setErrorMsg(
          data?.message || data?.error || err.message || "Something went wrong."
        );
      } else {
        setErrorMsg("Unexpected error.");
      }
    } finally {
      setIsGenLoading(false);
    }
  };

  return (
    <>
      {errorMsg && <ErrorMessage message={errorMsg} />}
      {validationErrors.length > 0 && (
        <ErrorBox>
          <ul>
            {validationErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </ErrorBox>
      )}{" "}
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
        <GlowingButton
          type="button"
          onClick={onGenerate}
          disabled={isGenLoading}
        >
          {isGenLoading ? "Generating a Recipe..." : "Generate"}
        </GlowingButton>
      </div>
    </>
  );
}

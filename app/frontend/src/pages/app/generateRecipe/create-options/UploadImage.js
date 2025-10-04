import { useDropzone } from "react-dropzone";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

import styles from "./UploadImage.module.css";
import IngredientItem from "../../../../components/data-display/IngredientItem";
import PreferencesForm from "../../../../components/data-display/PreferencesForm";
import { appAPI } from "../../../../http/api";
import { INITIAL_CONSTRAINTS } from "../../../../data/constants.js";
import { useDraftRecipe } from "../../../../store/recipeDraftContext.js";
import ErrorMessage from "../../../../components/UI/ErrorMessage.js";
import ErrorBox from "../../../../components/UI/ErrorBox.js";
import GlowingButton from "../../../../components/UI/GlowingButton.js";
import { useUser } from "../../../../store/userContext.js";

export default function UploadImage() {
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([""]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isGenLoading, setIsGenLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const userCtx = useUser();
  const [preferences, setPreferences] = useState({
    ...INITIAL_CONSTRAINTS,
    ...userCtx.user.defaultPreferences,
  });
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

  const getIngredientsByImage = async () => {
    if (!imageFile) {
      setErrorMsg("Select an image.");
      return;
    }
    try {
      setIsImageLoading(true);
      setErrorMsg("");
      setValidationErrors([]);
      const fd = new FormData();
      fd.append("image", imageFile);

      const { data } = await appAPI.post("/image-upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.error) {
        setErrorMsg("Error in Generating Ingredients: " + data.error);
        return;
      }
      setIngredients((prev) => {
        if (prev.length === 1 && prev[0] === "") return data.ingredients;
        else {
          return [...prev].concat(data.ingredients);
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data || err.message || "Unexpected";
      setErrorMsg("Error in Generating Ingredients: " + errorMessage);
    } finally {
      setIsImageLoading(false);
    }
  };

  const onGenerate = async () => {
    try {
      setIsGenLoading(true);
      setErrorMsg("");
      setValidationErrors([]);
      const { data } = await appAPI.post("/image-generate", {
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

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (accepted) => {
      setImageFile(accepted[0]);
    },
  });

  const message = useMemo(() => {
    if (isDragReject) return "File type not supported";
    if (isDragAccept) return "Drop to upload";
    if (isDragActive) return "Drop here";

    if (imageFile) {
      return `Selected: ${imageFile.name}`;
    }

    return "Drag & drop an image here, or click to select";
  }, [isDragReject, isDragAccept, isDragActive, imageFile]);

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
      )}

      <div className={styles.container}>
        <div className={styles.imageUploadContainer}>
          <h2>Upload a photo of ingredients</h2>
          {isImageLoading ? (
            <div className={styles.spinnerContainer}>
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <div {...getRootProps({ className: styles.dropzone })}>
                <input {...getInputProps()} />
                <p className={styles.dropzoneMessage}>{message}</p>
              </div>
              {fileRejections.length > 0 && (
                <p className={styles.errorFileMessage}>
                  {fileRejections[0].errors[0]?.message ||
                    "File is not supported, please try again"}
                </p>
              )}
            </>
          )}
          <button
            type="button"
            className={styles.detectButton}
            onClick={getIngredientsByImage}
            disabled={isImageLoading}
          >
            <span>{isImageLoading ? "Loading..." : "Detect Ingredients"}</span>
          </button>
        </div>
        <div className={styles.detectedIng}>
          <h2>
            Detected Ingredients <span> (editable)</span>
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
            columns={3}
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

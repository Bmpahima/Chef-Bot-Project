import { useDropzone } from "react-dropzone";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

import styles from "./UploadImage.module.css";
import IngredientItem from "../../../../components/data-display/IngredientItem";
import PreferencesForm from "../../../../components/data-display/PreferencesForm";
import { appAPI } from "../../../../http/api";
import { INITIAL_CONSTRAINTS } from "../../../../data/constants.js";
import { useDraftRecipe } from "../../../../store/recipeDraftContext.js";

export default function UploadImage() {
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([""]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isGenLoading, setIsGenLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [preferences, setPreferences] = useState(INITIAL_CONSTRAINTS);

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
      setErrorMsg((prev) => ({ ...prev, image: "Select an image" }));
      return;
    }
    try {
      setIsImageLoading(true);
      const fd = new FormData();
      fd.append("image", imageFile);

      const { data } = await appAPI.post("/image-upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.error) {
        setErrorMsg("Error in Generating Ingredients: " + data.error);
        return;
      }
      console.log(data.message);
      setIngredients((prev) => {
        if (prev.length === 1 && prev[0] === "") return data.ingredients;
        else {
          return [...prev].concat(data.ingredients);
        }
      });
    } catch (err) {
      setErrorMsg("Error in Generating Ingredients: " + err.message);
    } finally {
      setIsImageLoading(false);
    }
  };

  const onGenerate = async () => {
    try {
      setIsGenLoading(true);
      const { data } = await appAPI.post("/image-generate", {
        ingredients: ingredients.filter((i) => i !== ""),
        constraints: preferences,
      });

      if (data?.error) {
        setErrorMsg("Error in Generating Recipe: " + data.error);
        return;
      }

      console.log(data.recipe);
      draftCtx.saveDraft(data.recipe);
      navigate("/app/preview");
    } catch (err) {
      setErrorMsg("Error in Generating Ingredients: " + err.message);
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

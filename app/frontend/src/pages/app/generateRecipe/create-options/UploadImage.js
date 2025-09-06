import { useDropzone } from "react-dropzone";
import { useState, useMemo } from "react";

import styles from "./UploadImage.module.css";
import IngredientItem from "../../../../components/data-display/IngredientItem";
import { dummyIngredients } from "../../../../data/data";
import PreferencesForm from "../../../../components/data-display/PreferencesForm";

export default function UploadImage() {
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState(dummyIngredients);

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
      console.log(accepted[0]);
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
          <button type="button" className={styles.detectButton}>
            <span>Detect Ingredients</span>
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
          <PreferencesForm />
        </div>
      </div>
      <div className={styles.submittion}>
        <button type="button" className={styles.generateBtn}>
          Generate
        </button>
      </div>
    </>
  );
}

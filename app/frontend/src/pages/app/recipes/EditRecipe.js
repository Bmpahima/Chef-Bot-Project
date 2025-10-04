import { useRouteLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import NavbarBig from "../../../components/layout/NavbarBig";
import styles from "./EditRecipe.module.css";
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
} from "../../../data/constants.js";
import IngredientEditInput from "../../../components/data-display/IngredientEditInput.js";
import { appAPI } from "../../../http/api.js";
import ErrorMessage from "../../../components/UI/ErrorMessage.js";
import ErrorBox from "../../../components/UI/ErrorBox.js";

export default function EditRecipe() {
  const loaderData = useRouteLoaderData("recipe");
  const navigate = useNavigate();

  // const loading = navigation.state === "loading";
  const [saveLoading, setSaveLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  const [formData, setFormData] = useState(() => loaderData.recipe);

  const onFormChange = (event, payload) => {
    try {
      const { name, value, checked } = event.target;
      console.log(event.target);

      setFormData((prev) => {
        switch (name) {
          case "name":
          case "instructions":
            return { ...prev, [name]: value };
          case "ingredientName":
          case "amount":
          case "unit":
            if (!payload || !payload._id) return prev;
            const index = prev.ingredients.findIndex(
              (v) => v._id === payload._id
            );
            if (index < 0) return prev;
            const newIngredients = prev.ingredients.map((ing, i) =>
              i === index ? payload : ing
            );
            return {
              ...prev,
              ingredients: newIngredients,
            };
          case "cuisine":
            const cuisine = !checked
              ? prev.cuisine.filter((v) => v !== value)
              : [...prev.cuisine, value];
            return { ...prev, cuisine: cuisine };
          case "difficulty":
            return { ...prev, difficulty: value };
          case "servings":
            return { ...prev, servings: +value };
          case "kosher":
            return { ...prev, kosher: !prev.kosher };
          case "vegetarian":
            return { ...prev, vegetarian: !prev.vegetarian };
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
      console.log(formData);
    } catch (err) {
      setErrMsg("ERROR: " + err.message);
    }
  };

  const onClickSave = async () => {
    try {
      setSaveLoading(true);
      const formatted = {
        ...formData,
        prepTimeMinutes: formData.prepTimeMinutes
          ? `${formData.prepTimeMinutes} min`
          : "0 min",
        cookTimeMinutes: formData.cookTimeMinutes
          ? `${formData.cookTimeMinutes} min`
          : "0 min",
      };
      console.log(formatted);

      const { data } = await appAPI.put("/edit-recipe", {
        updatedRecipe: formatted,
      });

      if (!data || data.error) {
        throw new Error("Failed to update recipe " + data?.error);
      }

      navigate(`/app/recipes/${formData._id}`, {
        replace: true,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErrMsg("Network error. Please try again.");
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

        setErrMsg(
          data?.message || data?.error || err.message || "Something went wrong."
        );
      } else {
        setErrMsg("Unexpected error.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    if (!loaderData || !loaderData.recipe)
      throw new Error("No recipe has been found. Please try again later.");
    setFormData({
      ...loaderData.recipe,
      prepTimeMinutes: +loaderData.recipe.prepTimeMinutes.split(" ")[0],
      cookTimeMinutes: +loaderData.recipe.cookTimeMinutes.split(" ")[0],
    });
  }, [loaderData]);

  return (
    <>
      <title>ChefBot - Edit Recipe</title>
      <div className={styles.pageContainer}>
        <NavbarBig />
        <main className={styles.container}>
          <section className={styles.header}>
            <div className={styles.title}>
              <h1>Edit Your Recipe</h1>
              <div className={styles.imgContainer}>
                {formData?.imageUrl ? (
                  <img src={formData.imageUrl} alt={formData.name} />
                ) : (
                  <div className={styles.noImage} />
                )}
              </div>
            </div>
            {errMsg && <ErrorMessage message={errMsg} />}
            {validationErrors.length > 0 && (
              <ErrorBox>
                <ul>
                  {validationErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </ErrorBox>
            )}
          </section>
          <section className={styles.formSection}>
            <form className={styles.editForm}>
              <div className={styles.textInput}>
                <label htmlFor="name">Recipe's Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={onFormChange}
                />
              </div>
              <div className={styles.textInput}>
                <label>Ingredients</label>
                {formData.ingredients.map((value) => (
                  <IngredientEditInput
                    key={`ing-${value._id}`}
                    ingredient={value}
                    onChange={onFormChange}
                  />
                ))}
              </div>
              <div className={styles.textInput}>
                <label htmlFor="instructions">Instructions</label>
                <textarea
                  type="text"
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={onFormChange}
                />
              </div>
              <fieldset className={styles.cuisineContainer}>
                <legend>Cuisine</legend>
                <div className={styles.cuisineOptions}>
                  {CUISINE_OPTIONS.map((cuisine) => (
                    <label
                      key={cuisine.value}
                      htmlFor={`cuisine-${cuisine.value}`}
                      style={{ display: "block" }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.cuisine.includes(cuisine.value)}
                        name="cuisine"
                        value={cuisine.value}
                        onChange={onFormChange}
                        id={`cuisine-${cuisine.value}`}
                      />
                      {cuisine.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className={styles.flavorsContainer}>
                <label>Flavor</label>
                <div className={styles.flavorsOptions}>
                  {FLAVOR_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      className={styles.flavorBtn}
                      style={
                        formData.flavors.includes(opt.value)
                          ? { background: opt.color }
                          : {}
                      }
                      name="flavors"
                      value={opt.value}
                      onClick={onFormChange}
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
                    value={formData.servings}
                    name="servings"
                    onChange={onFormChange}
                    id="servings"
                  />
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
                        checked={
                          diet.key === "kosher"
                            ? formData.kosher
                            : formData.vegetarian
                        }
                        name={diet.key}
                        value={diet.key}
                        onChange={onFormChange}
                        id={`diet-${diet.key}`}
                      />
                      {diet.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className={styles.diffContainer}>
                <label>Difficulty</label>
                <div className={styles.diffOptions}>
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      name="difficulty"
                      value={opt.value}
                      onClick={onFormChange}
                      className={styles.diffBtn}
                      style={
                        formData.difficulty === opt.value
                          ? { background: opt.color, color: "#000" }
                          : undefined
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.timesContainer}>
                <div className={styles.prepCookContainer}>
                  <label htmlFor="prepTimeMinutes">
                    Preperation Time
                    <span className={styles.minutesLabel}>{" (min)"}</span>
                  </label>
                  <input
                    type="number"
                    min={PREP_TIME_MIN}
                    max={PREP_TIME_MAX}
                    value={formData.prepTimeMinutes}
                    name="prepTimeMinutes"
                    id="prepTimeMinutes"
                    onChange={onFormChange}
                  />
                </div>
                <div className={styles.prepCookContainer}>
                  <label htmlFor="cookTimeMinutes">
                    Cook Time
                    <span className={styles.minutesLabel}>{" (min)"}</span>
                  </label>
                  <input
                    type="number"
                    min={COOK_TIME_MIN}
                    max={COOK_TIME_MAX}
                    value={formData.cookTimeMinutes}
                    name="cookTimeMinutes"
                    id="cookTimeMinutes"
                    onChange={onFormChange}
                  />
                </div>
              </div>
              <section className={styles.optionBtns}>
                <button
                  type="button"
                  disabled={saveLoading}
                  onClick={onClickSave}
                >
                  {saveLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  disabled={saveLoading}
                  onClick={() => {
                    navigate(`/app/recipes/${formData._id}`);
                  }}
                >
                  Cancel
                </button>
              </section>
            </form>
          </section>
        </main>
      </div>
    </>
  );
}

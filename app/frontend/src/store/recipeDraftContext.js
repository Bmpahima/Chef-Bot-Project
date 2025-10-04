import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { appAPI } from "../http/api";

const INITIAL_RECIPE = {
  name: "",
  ingredients: [],
  instructions: "",
  vegetarian: null,
  kosher: null,
  cuisine: [],
  difficulty: "",
  flavors: [],
  servings: null,
  prepTime: "",
  cookTime: "",
};

const RecipeDraftContext = createContext({
  recipe: null,
  hasDraft: false,
  saveDraft: () => {},
  clearDraft: () => {},
  saveDraftOnDB: async () => {},
});
export const useDraftRecipe = () => useContext(RecipeDraftContext);

export function RecipeDraftProvider({ children }) {
  const [recipe, setRecipe] = useState(INITIAL_RECIPE);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("recipe_draft");
      if (raw) setRecipe(JSON.parse(raw));
    } catch {}
  }, []);

  const hasDraft = !!recipe?.name;

  useEffect(() => {
    if (hasDraft)
      sessionStorage.setItem("recipe_draft", JSON.stringify(recipe));
    else sessionStorage.removeItem("recipe_draft");
  }, [hasDraft, recipe]);

  const saveDraft = (draft) => {
    setRecipe({ ...INITIAL_RECIPE, ...draft });
  };

  const clearDraft = () => {
    setRecipe(INITIAL_RECIPE);
  };

  const saveDraftOnDB = useCallback(async () => {
    try {
      if (!recipe || !recipe.name) {
        return { error: "No draft to save. Generate a recipe first." };
      } else {
        const { data } = await appAPI.post("/save-recipe", { recipe: recipe });
        if (!data || data.error) {
          return {
            error: data?.error || "Failed to save draft, please try again.",
          };
        }
        clearDraft();
        return { message: "Recipe saved succesfully" };
      }
    } catch (err) {
      return {
        error:
          err.response?.data ||
          err.message ||
          "Failed to save draft, please try again.",
      };
    }
  }, [recipe]);

  const value = {
    recipe,
    hasDraft: !!recipe.name,
    saveDraft,
    clearDraft,
    saveDraftOnDB,
  };

  return (
    <RecipeDraftContext.Provider value={value}>
      {children}
    </RecipeDraftContext.Provider>
  );
}

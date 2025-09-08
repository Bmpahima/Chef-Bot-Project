export const CUISINE_OPTIONS = [
  { value: "italian", label: "Italian" },
  { value: "french", label: "French" },
  { value: "american", label: "American" },
  { value: "asian", label: "Asian" },
  { value: "indian", label: "Indian" },
  { value: "mexican", label: "Mexican" },
  { value: "middle-eastern", label: "Middle Eastern" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "israeli", label: "Israeli" },
  { value: "other", label: "Other" },
];

export const FLAVOR_OPTIONS = [
  { value: "spicy", label: "Spicy 🌶️", color: "#e63946" },
  { value: "sweet", label: "Sweet 🍯", color: "#f4a261" },
  { value: "salty", label: "Salty 🧂", color: "#457b9d" },
  { value: "savory", label: "Savory / Umami 🍲", color: "#6d6875" },
  { value: "sour", label: "Sour 🍋", color: "#f9c74f" },
  { value: "bitter", label: "Bitter 🍫", color: "#4a2c2a" },
  { value: "fresh", label: "Fresh / Light 🥗", color: "#2a9d8f" },
  { value: "comfort", label: "Comfort Food 🍝", color: "#d4a373" },
];

export const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy", color: "#2ecc71" },
  { value: "medium", label: "Medium", color: "#f1c40f" },
  { value: "hard", label: "Hard", color: "#e74c3c" },
];

export const SERVINGS_DEFAULT = 1;
export const SERVINGS_MIN = 1;
export const SERVINGS_MAX = 20;

export const TIME_MINUTES_DEFAULT = 0;
export const PREP_TIME_MIN = 0;
export const PREP_TIME_MAX = 240;
export const COOK_TIME_MIN = 0;
export const COOK_TIME_MAX = 480;

export const DIET_TOGGLES = [
  { key: "vegetarian", label: "Vegetarian" },
  { key: "kosher", label: "Kosher" },
];

export const INITIAL_CONSTRAINTS = {
  cuisine: ["other"],
  difficulty: "easy",
  diet: ["kosher"],
  servings: SERVINGS_DEFAULT,
  prepTimeMinutes: TIME_MINUTES_DEFAULT,
  cookTimeMinutes: TIME_MINUTES_DEFAULT,
  cuisineOtherText: "",
  flavors: ["comfort"],
};

import styles from "./IngredientEditInput.module.css";
import { INGREDIENTS_UNITS } from "../../data/constants";

export default function IngredientEditInput({ ingredient, onChange }) {
  const onIngredientChange = (event) => {
    const { value, name } = event.target;
    const normalized =
      name === "amount" ? (value === "" ? "" : Number(value)) : value;
    const payload = {
      ...ingredient,
      [name]: normalized,
    };

    onChange(event, payload);
  };
  return (
    <div className={styles.container}>
      <input
        className={styles.ingName}
        type="text"
        name="ingredientName"
        value={ingredient.ingredientName}
        onChange={onIngredientChange}
      />
      <input
        className={styles.ingAmount}
        type="number"
        name="amount"
        step="any"
        value={ingredient.amount}
        onChange={onIngredientChange}
      />
      <select
        id="ingUnit"
        className={styles.ingUnit}
        name="unit"
        value={ingredient.unit}
        onChange={onIngredientChange}
      >
        {INGREDIENTS_UNITS.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}

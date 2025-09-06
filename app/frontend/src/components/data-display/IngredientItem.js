import styles from "./IngredientItem.module.css";
import { MdClear } from "react-icons/md";

export default function IngredientItem({ text, onChange, onClear }) {
  return (
    <div className={styles.ingItem}>
      <input value={text} onChange={onChange} placeholder="Ingredient name" />
      <button type="button" onClick={onClear} aria-label="Clear ingredient">
        <MdClear color="white" />
      </button>
    </div>
  );
}

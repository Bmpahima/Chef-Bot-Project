import { useSearchParams } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useEffect, useMemo, useState } from "react";

import styles from "./RecipesPage.module.css";
import NavbarBig from "../../../components/layout/NavbarBig";
import RecipeCard from "../../../components/data-display/RecipeCard";
import { appAPI } from "../../../http/api";

const PAGE_SIZE = 9;

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  const showingText = useMemo(() => {
    const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return `Showing ${start}-${end} of ${total} — Page ${page}`;
  }, [page, total]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErrMsg("");
      try {
        const { data } = await appAPI.get("/recipes-all", {
          params: { page, limit: PAGE_SIZE },
        });
        if (data?.error) {
          setErrMsg(data.error);
          setRecipes([]);
          setTotal(0);
          return;
        }
        if (!cancelled) {
          console.log(data);
          setRecipes(data?.recipes ?? []);
          setTotal(data?.total ?? 0);
        }
      } catch (e) {
        if (!cancelled) {
          setRecipes([]);
          setTotal(0);
          setErrMsg(e?.message || "Failed to load recipes");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const goToPage = (next) => {
    if (next < 1 || next > totalPages || next === page) return;
    setSearchParams({ page: String(next) });
  };

  return (
    <div className={styles.pageContainer}>
      <NavbarBig />

      <main className={styles.container}>
        <section className={styles.header}>
          <h1>Your Recipes</h1>
          <div className={styles.actionsContainer}>
            <div className={styles.genButton}>
              <button /* onClick={() => navigate("/app/create")} */>
                Generate Recipe
              </button>
            </div>
            <div>
              <span>Filter</span>
            </div>
            <div>
              <span>Sort: Recent</span>
            </div>
          </div>
        </section>

        <section className={styles.recipeGrid}>
          {loading ? (
            <p>Loading…</p>
          ) : errMsg ? (
            <p style={{ color: "crimson" }}>{errMsg}</p>
          ) : recipes.length === 0 ? (
            <p>No recipes yet.</p>
          ) : (
            recipes.map((r) => <RecipeCard key={r._id || r.id} recipe={r} />)
          )}
        </section>

        <section className={styles.pageSelector}>
          <p>{showingText}</p>
          <div className={styles.paginationContainer}>
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || loading}
              aria-label="Previous page"
            >
              <AiOutlineArrowLeft size="20px" color="#fff" />
            </button>

            <p aria-live="polite">{page}</p>

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages || loading}
              aria-label="Next page"
            >
              <AiOutlineArrowRight size="20px" color="#fff" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

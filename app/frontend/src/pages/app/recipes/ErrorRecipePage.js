import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import styles from "./ErrorRecipePage.module.css";
import NavbarBig from "../../../components/layout/NavbarBig";

export default function ErrorRecipePage() {
  const err = useRouteError();
  const navigate = useNavigate();

  let message = "";
  if (isRouteErrorResponse(err)) {
    message = err.data?.message || `${err.status} ${err.statusText}`;
  } else {
    message = err instanceof Error ? err.message : "Somthing went wrong";
  }

  return (
    <>
      <title>Recipe Not Found</title>
      <div className={styles.pageContainer}>
        <NavbarBig />
        <main className={styles.container}>
          <div className={styles.title}>
            <h1>No Recipe Found</h1>
            <h5>cause:</h5>
            <h5>{message}</h5>
          </div>
          <button
            onClick={() => {
              navigate("/app/dashboard");
            }}
          >
            Go to dashboard
          </button>
        </main>
      </div>
    </>
  );
}

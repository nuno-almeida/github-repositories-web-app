import { useContext, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AlertDialog from "../utils/AlertDialog";
import AuthContext from "../../contexts/AuthContext";
import Loading from "../utils/Loading";
import AuthWrapper from "../ui/AuthWrapper";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location?.state?.replaceUrl || "/";

  const [userName, setUserName] = useState("");
  const [pass, setPass] = useState("");

  const [status, setStatus] = useState({
    loading: false,
    done: false,
    ok: false,
    message: "",
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();

    setStatus((prev) => ({ ...prev, loading: true }));

    login({ userName, pass }).then((resp) =>
      resp.ok
        ? navigate(redirectTo)
        : setStatus((prev) => ({
            ...prev,
            loading: false,
            ok: false,
            done: true,
            message: resp.message,
          }))
    );
  };

  const onUserChangeHandler = (value) => {
    setStatus((prev) => ({ ...prev, done: false }));
    setUserName(value);
  };

  const onPassChangeHandler = (value) => {
    setStatus((prev) => ({ ...prev, done: false }));
    setPass(value);
  };

  return (
    <AuthWrapper>
      <form onSubmit={onSubmitHandler} className="d-flex flex-column gap-1">
        <label>
          <strong>Username</strong>
        </label>
        <input
          className="input-group-text"
          type="text"
          value={userName}
          aria-label="username-input"
          placeholder="username"
          onChange={(e) => onUserChangeHandler(e.target.value)}
          style={{ textAlign: "start" }}
        />

        <label>
          <strong>Password</strong>
        </label>
        <input
          className="input-group-text"
          type="password"
          value={pass}
          aria-label="password-input"
          placeholder="******"
          onChange={(e) => onPassChangeHandler(e.target.value)}
          autoComplete="off"
          style={{ textAlign: "start" }}
        />

        <button
          type="submit"
          className="btn btn-dark my-2"
          disabled={!userName || !pass || status.loading}
        >
          {status.loading ? <Loading /> : "Login"}
        </button>

        {status.done && (
          <AlertDialog
            type={status.ok ? "info" : "danger"}
            message={status.message}
          />
        )}

        <p>
          Don't have an account?&nbsp;
          <Link to="/register" className="text-primary">
            Click here to sign up.
          </Link>
        </p>
      </form>
    </AuthWrapper>
  );
};

export default Login;

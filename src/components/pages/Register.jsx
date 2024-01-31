import { useContext, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import AlertDialog from "../utils/AlertDialog";
import AuthContext from "../../contexts/AuthContext";
import Loading from "../utils/Loading";
import AuthWrapper from "../ui/AuthWrapper";
import { validateEmail, validateUserName } from "../../utils/helpers";

const initialState = {
  pending: false,
  ok: true,
  message: "",
  done: false,
};

const reducer = (state, action) => {
  const { type } = action;

  if (type === "PENDING") {
    return {
      ...state,
      pending: true,
    };
  }

  if (type === "FULFILLED") {
    const { message } = action.payload;

    return {
      ...state,
      pending: false,
      ok: true,
      message,
      done: true,
    };
  }

  if (type === "REJECTED") {
    const { message } = action.payload;

    return {
      ...state,
      pending: false,
      ok: false,
      message,
      done: true,
    };
  }

  return state;
};

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [invalidUserName, setInvalidUserName] = useState(false);
  const [invalidUserNameMessage, setInvalidUserNameMessage] = useState("");

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidEmailMessage, setInvalidEmailMessage] = useState("");

  const [invalidPass, setInvalidPass] = useState(false);
  const [invalidConfirmPass, setInvalidConfirmPass] = useState(false);

  const { register } = useContext(AuthContext);

  const [state, dispacth] = useReducer(reducer, initialState);
  const { pending, ok, message, done } = state;

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const userValidation = validateUserName(userName);
    if (!userValidation.ok) {
      setInvalidUserName(true);
      setInvalidUserNameMessage(userValidation.message);
      return;
    }

    if (email.length !== 0) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.ok) {
        setInvalidEmail(true);
        setInvalidEmailMessage(emailValidation.message);
        return;
      }
    }

    if (pass.length < 6) {
      setInvalidPass(true);
      return;
    }

    if (pass !== confirmPass) {
      setInvalidConfirmPass(true);
      return;
    }

    // all good
    dispacth({ type: "PENDING" });

    register({ userName, email, pass })
      .then(() => {
        dispacth({
          type: "FULFILLED",
          payload: { message: "User registration succeeded" },
        });
      })
      .catch(() => {
        dispacth({
          type: "REJECTED",
          payload: { message: "User registration failed" },
        });
      });
  };

  return (
    <AuthWrapper>
      <form onSubmit={onSubmitHandler} className="d-flex flex-column gap-1">
        <label>
          <strong>
            Username<span className="text-danger">*</span>
          </strong>
        </label>
        <input
          className="input-group-text"
          type="text"
          value={userName}
          aria-label="username-input"
          placeholder="username"
          onChange={(e) => {
            setInvalidUserName(false);
            setUserName(e.target.value);
          }}
          style={{ textAlign: "start" }}
        />
        {invalidUserName && (
          <p className="text-danger small">{invalidUserNameMessage}</p>
        )}

        <label>
          <strong>Email</strong>
        </label>
        <input
          className="input-group-text"
          type="text"
          value={email}
          aria-label="email-input"
          placeholder="user@email.com"
          onChange={(e) => {
            setInvalidEmail(false);
            setEmail(e.target.value);
          }}
          style={{ textAlign: "start" }}
        />
        {invalidEmail && (
          <p className="text-danger small">{invalidEmailMessage}</p>
        )}

        <label>
          <strong>
            Password<span className="text-danger">*</span>
          </strong>
        </label>
        <input
          className="input-group-text"
          type="password"
          value={pass}
          aria-label="password-input"
          placeholder="******"
          autoComplete="off"
          onChange={(e) => {
            setInvalidPass(false);
            setPass(e.target.value);
          }}
          style={{ textAlign: "start" }}
        />
        {invalidPass && (
          <p className="text-danger small">
            Password should have at least 6 characters
          </p>
        )}

        <label>
          <strong>
            Confirm Password<span className="text-danger">*</span>
          </strong>
        </label>
        <input
          className="input-group-text"
          type="password"
          value={confirmPass}
          aria-label="confirm-password-input"
          placeholder="******"
          autoComplete="off"
          onChange={(e) => {
            setInvalidConfirmPass(false);
            setConfirmPass(e.target.value);
          }}
          style={{ textAlign: "start" }}
        />
        {invalidConfirmPass && (
          <p className="text-danger small">Passwords not match</p>
        )}

        <button
          type="submit"
          className="btn btn-dark my-2"
          disabled={pending || (done && ok) || !userName || !pass || !confirmPass}
        >
          {pending ? <Loading /> : "Register"}
        </button>

        {done && (
          <AlertDialog type={ok ? "info" : "danger"} message={message} />
        )}

        <p>
          Already have an account?&nbsp;
          <Link to="/login" className="text-primary">
            Login here.
          </Link>
        </p>
      </form>
    </AuthWrapper>
  );
};

export default Register;

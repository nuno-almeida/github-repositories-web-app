import { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { validateEmail, validateUserName } from "../../utils/helpers";
import Loading from "../utils/Loading";
import AlertDialog from "../utils/AlertDialog";

const MyAccount = () => {
  const { user, updateAccount } = useContext(AuthContext);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [invalidUserName, setInvalidUserName] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidUserNameMessage, setInvalidUserNameMessage] = useState("");
  const [invalidEmailMessage, setInvalidEmailMessage] = useState("");

  useEffect(() => {
    !!user?.userName && setUserName(user.userName);
    !!user?.email && setEmail(user.email);
  }, [user]);

  const [status, setStatus] = useState({
    loading: false,
    done: false,
    ok: false,
    message: "User account successfully updated",
  });

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

    setStatus((prev) => ({
      ...prev,
      loading: true,
    }));

    updateAccount({ userName, email }).then(() =>
      setStatus((prev) => ({
        ...prev,
        loading: false,
        ok: true,
        done: true,
      }))
    );
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="d-flex flex-column align-items-start gap-1 px-3 py-2"
    >
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
          setStatus((prev) => ({ ...prev, done: false }));
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

      <button
        type="submit"
        className="btn btn-dark my-2"
        disabled={status.loading || !userName}
      >
        {status.loading ? <Loading /> : "Save"}
      </button>

      {status.done && (
        <AlertDialog
          type={status.ok ? "info" : "danger"}
          message={status.message}
        />
      )}
    </form>
  );
};

export default MyAccount;

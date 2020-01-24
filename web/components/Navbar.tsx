import Link from "next/link";
import { useContext, useState, FormEvent } from "react";

import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

import UserContext from "../contexts/UserContext";

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      email,
      password
    });
  };

  return (
    <form onSubmit={submit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input type="submit" />
      </label>
    </form>
  );
};

const Navbar: React.FC = () => {
  const { user, logout } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const { login } = useContext(UserContext);

  const onSubmit = async ({ email, password }) => {
    const { status, statusText } = await login(email, password);

    // TODO: handle case to show error if present
    if (status === 200) {
      setShowLogin(false);
    }
  };
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "row"
      }}
    >
      <ul
        style={{
          display: "flex",
          flexDirection: "row",
          listStyle: "none",
          margin: 0,
          padding: 0
        }}
      >
        <li style={{ padding: "0 16px" }}>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/questions">
            <a>Questions</a>
          </Link>
        </li>
      </ul>
      {user ? (
        <div
          style={{
            marginLeft: "auto"
          }}
        >
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <>
          <button
            onClick={e => setShowLogin(state => !state)}
            style={{ marginLeft: "auto" }}
          >
            login
          </button>
          <Dialog isOpen={showLogin}>
            <LoginForm onSubmit={onSubmit} />
          </Dialog>
        </>
      )}
    </nav>
  );
};

export default Navbar;

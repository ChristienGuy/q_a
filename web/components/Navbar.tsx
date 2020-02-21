import Link from "next/link";
import { useContext, useState, FormEvent } from "react";

import { Dialog } from "@reach/dialog";

import UserContext from "../contexts/UserContext";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import styles from "./Navbar.scss";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      username
      email
      id
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data }] = useMutation(LOGIN_MUTATION);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await login({
      variables: {
        email,
        password
      }
    });

    onLogin(result.data.login);
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
  const { setUser, user } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const [logout, { data }] = useMutation(LOGOUT_MUTATION);

  const onLogin = loginResponse => {
    setShowLogin(false);
    setUser(loginResponse);
  };

  const logoutHandler = () => {
    logout();
    setUser(null);
    // TODO: clear apollo cache when logging out
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.listItem}>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href="/question/add">
            <a>Add a Question</a>
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
          <button onClick={logoutHandler}>Logout</button>
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
            <LoginForm onLogin={onLogin} />
          </Dialog>
        </>
      )}
    </nav>
  );
};

export default Navbar;

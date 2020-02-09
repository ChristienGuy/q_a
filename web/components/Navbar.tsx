import Link from "next/link";
import { useContext, useState, FormEvent } from "react";

import { Dialog } from "@reach/dialog";

import UserContext from "../contexts/UserContext";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      username
      email
      id
    }
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

  const onLogin = loginResponse => {
    setShowLogin(false);
    setUser(loginResponse);
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
          {/* <button onClick={logout}>Logout</button> */}
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

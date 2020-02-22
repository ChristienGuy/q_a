import Link from "next/link";
import { useContext, useState, FormEvent } from "react";

import UserContext from "../contexts/UserContext";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import s from "./Navbar.scss";
import { AuthDialog } from "./AuthDialog/AuthDialog";

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const Navbar: React.FC = () => {
  const { setUser, user } = useContext(UserContext);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [logout, { data }] = useMutation(LOGOUT_MUTATION);

  const logoutHandler = () => {
    logout();
    setUser(null);
    // TODO: clear apollo cache when logging out
  };

  return (
    <nav className={s.nav}>
      <ul className={s.navList}>
        <li className={s.listItem}>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li className={s.listItem}>
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
            onClick={e => setShowAuthDialog(state => !state)}
            style={{ marginLeft: "auto" }}
          >
            login
          </button>
          <AuthDialog
            isOpen={showAuthDialog}
            onDismiss={() => setShowAuthDialog(false)}
          />
        </>
      )}
    </nav>
  );
};

export default Navbar;

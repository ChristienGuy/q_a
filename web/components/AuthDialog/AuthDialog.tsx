import { Dialog } from "@reach/dialog";
import { useContext, useState, FormEvent, InputHTMLAttributes } from "react";
import UserContext from "../../contexts/UserContext";
import { useMutation } from "@apollo/react-hooks";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@reach/tabs";

import "@reach/tabs/styles.css";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "./mutations";
import { User } from "../../types/api";

import s from "./AuthDialog.scss";

const Label: React.FC = ({ children, ...props }) => {
  return (
    <label {...props} className={s.label}>
      {children}
    </label>
  );
};

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  children,
  ...props
}) => {
  return <input {...props}>{children}</input>;
};

const LoginForm: React.FC<{
  onLogin: (user: User) => void;
}> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data }] = useMutation<{ login: User }>(LOGIN_MUTATION);

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
    <form onSubmit={submit} className={s.form}>
      <Label>
        Email
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </Label>
      <Label>
        Password
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </Label>
      <Input type="submit" value="Login" />
    </form>
  );
};

const RegisterForm: React.FC<{
  onRegister: (user: User) => void;
}> = ({ onRegister }) => {
  const [register, { data }] = useMutation<{ register: User }>(
    REGISTER_MUTATION
  );
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = e.target["username"].value;
    const email = e.target["email"].value;
    const password = e.target["password"].value;

    const registerResponse = await register({
      variables: {
        username,
        email,
        password
      }
    });

    onRegister(registerResponse.data.register);
  };

  return (
    <form onSubmit={submit} className={s.form}>
      <Label>
        Username
        <Input type="string" name="username" />
      </Label>
      <Label>
        Email
        <Input type="email" name="email" />
      </Label>
      <Label>
        Password
        <Input type="password" name="password" />
      </Label>
      <Input type="submit" value="Register" />
    </form>
  );
};

const AuthDialog: React.FC<{
  isOpen: boolean;
  onDismiss: () => void;
  type?: "register" | "login";
}> = ({ isOpen, onDismiss, type = "login" }) => {
  const getDefaultIndex = () => {
    // TODO: replace type values with enum
    switch (type) {
      case "login":
        return 0;
      case "register":
        return 1;
      default:
        return 0;
    }
  };

  const { setUser, user } = useContext(UserContext);

  const onLogin = (user: User) => {
    setUser(user);
  };

  const onRegister = (user: User) => {
    setUser(user);
  };

  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss}>
      <Tabs defaultIndex={getDefaultIndex()}>
        <TabList>
          <Tab>login</Tab>
          <Tab>register</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <h1>Login</h1>
            <LoginForm onLogin={onLogin} />
          </TabPanel>
          <TabPanel>
            <h1>Register</h1>
            <RegisterForm onRegister={onRegister} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dialog>
  );
};

export { AuthDialog };

import React, { useState } from "react";
import App, { AppContext } from "next/app";
import { ThemeProvider } from "styled-components";
import fetch from "isomorphic-unfetch";

import { API_BASE_URL } from "../config";
import UserContext from "../contexts/UserContext";
import { User } from "../types/api";
import ApiClient from "../apiClient";

const theme = {
  colors: {
    primary: "#0070f3"
  }
};

const MyApp = ({ Component, pageProps, initialUser }) => {
  const [user, setUser] = useState<User>(initialUser);

  const login = async (email, password) => {
    const { status, statusText, response } = await ApiClient.login({
      email,
      password
    });

    if (status === 200) {
      setUser(response);
    }

    return {
      status,
      statusText,
      response
    };
  };

  const logout = async () => {
    // TODO: make request to clear jwt cookie
    await fetch(`${API_BASE_URL}/auth/logout`);
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

MyApp.getInitialProps = async (
  appContext: AppContext & {
    ctx: {
      req: {
        cookies: any;
      };
    };
  }
) => {
  let user = null;
  if (appContext.ctx.req) {
    // pass through to api layer
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      headers: {
        ...(appContext.ctx.req.headers as any)
      }
    });
    if (res.ok) {
      user = await res.json();
    }
  }

  const appProps = await App.getInitialProps(appContext);
  return {
    ...appProps,
    initialUser: user
  };
};

export default MyApp;

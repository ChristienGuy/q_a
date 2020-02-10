import React, { useState } from "react";
import gql from "graphql-tag";

import { withApollo } from "../apollo";
import UserContext from "../contexts/UserContext";

// import "@reach/dialog/styles.css";

const REFRESH_QUERY = gql`
  query Refresh {
    refresh {
      id
      username
      email
    }
  }
`;

const MyApp = ({ Component, pageProps, initialUser }) => {
  const [user, setUser] = useState(initialUser);

  return (
    <UserContext.Provider
      value={{
        setUser,
        user
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  const { apolloClient } = ctx;

  let user = null;

  const headers = ctx?.req?.headers;
  try {
    const { data, error } = await apolloClient.query({
      query: REFRESH_QUERY,
      context: {
        headers: {
          ...headers
        }
      }
    });

    if (error) {
      console.error(error);
    } else {
      user = data.refresh;
    }
  } catch (e) {
    console.error("error", e);
  }

  return {
    initialUser: user
  };
};

export default withApollo()(MyApp);

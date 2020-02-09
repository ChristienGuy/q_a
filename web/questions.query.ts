import gql from "graphql-tag";

const QUESTION_QUERY = gql`
  query Questions {
    questions {
      items {
        id
        title
        body
      }
    }
  }
`;

export default QUESTION_QUERY;

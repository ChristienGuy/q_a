import gql from "graphql-tag";

const QUESTION_QUERY = gql`
  query Questions($page: Int) {
    questions(page: $page) {
      items {
        id
        title
        body
      }
      total
    }
  }
`;

export default QUESTION_QUERY;

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FormEvent } from "react";
import MainLayout from "../../../components/MainLayout";

const ADD_QUESTION_MUTATION = gql`
  mutation AddQuestion($question: QuestionInput!) {
    addQuestion(question: $question) {
      title
      body
    }
  }
`;

const Add = () => {
  const [addQuestion, { data }] = useMutation(ADD_QUESTION_MUTATION);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addQuestion({
      variables: {
        question: {
          title: e.target["title"].value,
          body: e.target["body"].value
        }
      }
    });
  };
  return (
    <MainLayout>
      <h1>Add a question</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">
          Title
          <input type="text" name="title" id="title" />
        </label>
        <label htmlFor="body">
          Body
          <input type="text" name="body" id="body" />
        </label>
        <input type="submit" value="submit" />
      </form>

      <pre>
        <code>{JSON.stringify(data)}</code>
      </pre>
    </MainLayout>
  );
};

export default Add;

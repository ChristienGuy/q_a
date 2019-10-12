import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Question: React.FC = () => {
  const [question, setQuestion] = useState();
  const { query } = useRouter();

  useEffect(() => {
    fetch(`http://localhost:8888/question/${query.id}`)
      .then(res => res.json())
      .then(json => setQuestion(json));
  }, [query.id]);

  return <div>{JSON.stringify(question)}</div>;
};

export default Question;

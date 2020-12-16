import Head from "next/head";
import { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import Todo from "../components/Todo";
import { TodosContext } from "../contexts/TodosContext";
import { minifyRecords, table } from "./api/utils/airtable";
import auth0 from "./api/utils/auth0";

export default function Home({ initialTodos, user }) {
  const { todos, setTodos } = useContext(TodosContext);

  useEffect(() => {
    setTodos(initialTodos);
  }, []);

  return (
    <div>
      <Head>
        <title>Authenticate Todo App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main>
        <h1>Todo App</h1>
        {todos && todos.map((todo) => <Todo todo={todo} key={todo.id} />)}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await auth0.getSession(context.req);

  try {
    const todos = await table.select({}).firstPage();
    return {
      props: {
        initialTodos: minifyRecords(todos),
        user: session?.user || null,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        err: "Something went wrong",
      },
    };
  }
}

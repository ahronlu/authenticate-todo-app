import Head from "next/head";
import { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import Todo from "../components/Todo";
import TodoForm from "../components/TodoForm";
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
      <main>
        <Navbar user={user} />
        {user ? (
          <>
            <h1 className="text-2xl text-center mb-4">My Todos</h1>
            <TodoForm />
            <ul>
              {todos && todos.map((todo) => <Todo todo={todo} key={todo.id} />)}
            </ul>
          </>
        ) : (
          <p>You should log in to save your TODOs</p>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await auth0.getSession(context.req);
  let todos = [];

  try {
    if (session?.user) {
      todos = await table
        .select({ filterByFormula: `userId = '${session.user.sub}'` })
        .firstPage();
    }
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

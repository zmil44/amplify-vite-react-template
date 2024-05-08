import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Enter book title") });
  }

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
        
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s read books</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li 
                onClick={() => deleteTodo(todo.id)}
                key={todo.id}>
                  {todo.content}
              </li>))}
          </ul>
          <button onClick={signOut}>Sign out</button>
        </main>
        
      )}
      </Authenticator>
  );
}

export default App;

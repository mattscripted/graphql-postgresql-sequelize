```
mutation {
  createTodo(title: "Created with GraphQL") {
    title
  }
}

mutation {
  updateTodo(id: "3", title: "Updated title") {
    title
  }
}

mutation {
  deleteTodo(id: "5")
}

{
	getTodos {
    id
    title
    todoItems {
      id
      content
      complete
    }
  }
}

{
	getTodo(id: "1") {
    id
    title
    todoItems {
      id
      content
      complete
    }
  }
}

mutation {
  createTodoItem(todoId: "1", content: "todo item!") {
    todoId
    id
    content
    complete
  }
}

mutation {
  updateTodoItem(todoId: "1", id:"4", changes: {
    content: "Updated todo item",
    complete: true
  }) {
    todoId
    id
    content
    complete
  }
}

mutation {
  deleteTodoItem(todoId: "1", id: "4")
}
```
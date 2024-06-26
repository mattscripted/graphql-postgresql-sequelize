require('dotenv').config()
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const { Todo, TodoItem } = require('../db/models')

const schema = buildSchema(`
  input TodoItemInput {
    content: String
    complete: Boolean
  }

  type TodoItem {
    todoId: ID!
    id: ID!
    content: String!
    complete: Boolean!
  }

  type Todo {
    id: ID!
    title: String!
    todoItems: [TodoItem!]!
  }

  type Mutation {
    createTodo(title: String!): Todo!
    updateTodo(id: ID!, title: String!): Todo!
    deleteTodo(id: ID!): ID!

    createTodoItem(todoId: ID!, content: String!): TodoItem!
    updateTodoItem(todoId: ID!, id: ID!, changes: TodoItemInput): TodoItem!
    deleteTodoItem(todoId: ID!, id: ID!): ID!
  }

  type Query {
    getTodos: [Todo!]!
    getTodo(id: ID!): Todo!
  }
`)

const root = {
  async createTodo ({ title }) {
    try {
      return await Todo.create({
        title
      })
    } catch (error) {
      throw new Error('Cannot create Todo')
    }
  },

  async updateTodo ({ id, title }) {
    try {
      const todo = await Todo.findByPk(id, {
        include: [{
          model: TodoItem,
          as: 'todoItems'
        }]
      })

      return await todo.update({ title })
    } catch (error) {
      throw new Error(`Cannot update Todo with id ${id}`)
    }
  },

  async deleteTodo ({ id }) {
    try {
      const todo = await Todo.findByPk(id)
      await todo.destroy()

      return id
    } catch (error) {
      throw new Error(`Cannot delete Todo with id ${id}`)
    }
  },

  async getTodos () {
    try {
      return await Todo.findAll({
        include: [{
          model: TodoItem,
          as: 'todoItems'
        }]
      })
    } catch (error) {
      throw new Error('Cannot get Todos')
    }
  },

  async getTodo ({ id }) {
    try {
      return await Todo.findByPk(id, {
        include: [{
          model: TodoItem,
          as: 'todoItems'
        }]
      })
    } catch (error) {
      throw new Error(`Cannot get Todo with id ${id}`)
    }
  },

  async createTodoItem ({ todoId, content }) {
    try {
      return await TodoItem.create({
        todoId,
        content
      })
    } catch (error) {
      throw new Error('Cannot create Todo Item')
    }
  },

  async updateTodoItem ({ todoId, id, changes }) {
    try {
      const todoItem = await TodoItem.findOne({
        where: {
          todoId,
          id
        }
      })

      return await todoItem.update(changes, { fields: Object.keys(changes) })
    } catch (error) {
      throw new Error(`Cannot update Todo Item with todoId ${todoId} and id ${id}`)
    }
  },

  async deleteTodoItem ({ todoId, id }) {
    try {
      const todoItem = await TodoItem.findOne({
        where: {
          todoId,
          id
        }
      })
      await todoItem.destroy()

      return id
    } catch (error) {
      throw new Error(`Cannot delete Todo Item with todoId ${todoId} and id ${id}`)
    }
  }
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/graphql')

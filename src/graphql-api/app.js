require('dotenv').config()
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const { Todo, TodoItem } = require('../db/models')

const schema = buildSchema(`
  type TodoItem {
    content: String
    complete: Boolean
  }

  type Todo {
    title: String
    todoItems: [TodoItem]
  }

  type Mutation {
    createTodo(title: String): Todo
  }

  type Query {
    getTodos: [Todo]
  }
`)

const root = {
  async createTodo ({ title }) {
    return await Todo.create({
      title
    })
  },

  async getTodos () {
    return await Todo.findAll({
      include: [{
        model: TodoItem,
        as: 'todoItems'
      }]
    })
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

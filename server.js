const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const { v4: uuidv4 } = require('uuid')

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Mutation {
    setQuoteOfTheDay(quoteOfTheDay: String): String
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }

  type Query {
    hello: String
    getQuoteOfTheDay: String
    random: Float!
    getDie(numSides: Int): RandomDie
    getMessage(id: ID!): Message
  }
`)

const fakeDatabase = {
  quoteOfTheDay: 'Please set a quote of the day'
}

class Message {
  constructor (id, { content, author }) {
    this.id = id
    this.content = content
    this.author = author
  }
}

class RandomDie {
  constructor (numSides) {
    this.numSides = numSides
  }

  rollOnce () {
    return 1 + Math.floor(Math.random() * this.numSides)
  }

  roll ({ numRolls }) {
    const output = []
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce())
    }
    return output
  }
}

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!'
  },

  setQuoteOfTheDay: ({ quoteOfTheDay }) => {
    fakeDatabase.quoteOfTheDay = quoteOfTheDay
    return quoteOfTheDay
  },

  getQuoteOfTheDay: () => {
    return fakeDatabase.quoteOfTheDay
  },

  random: () => {
    return Math.random()
  },

  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6)
  },

  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`)
    }

    return new Message(id, fakeDatabase[id])
  },

  createMessage: ({ input }) => {
    const id = uuidv4()

    fakeDatabase[id] = input
    return new Message(id, input)
  },

  updateMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`)
    }

    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input
    return new Message(id, input)
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

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Mutation {
    setQuoteOfTheDay(quoteOfTheDay: String): String
  }

  type Query {
    hello: String
    getQuoteOfTheDay: String
    random: Float!
    getDie(numSides: Int): RandomDie
  }
`)

const fakeDatabase = {
  quoteOfTheDay: 'Please set a quote of the day'
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

const { buildSchema } = require('graphql');
const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLDate} = require('graphql');

/* module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
      _id: {
        type: GraphQLID
      },
      title: {
        type: GraphQLString
      },
      description: {
        type: GraphQLString
      },
      price: {
        type: GraphQLFloat
      },
      date: {
        type: GraphQLDate,
      },
    }
    )
  })
}); */

const typeDefs = `
type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
}

type User {
    _id: ID!
    email: String!
    password: String
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

input UserInput {
    email: String!
    password: String!
}

type Query {
  events(id: ID): [Event!]!
}

type Mutation {
  createEvent(eventInput: EventInput): Event
  createUser(userInput: UserInput): User
}

schema {
  query: Query
  mutation: Mutation
}

`;

module.exports = typeDefs;
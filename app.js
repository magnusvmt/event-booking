const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
//const graphQlSchema = require('./graphql/schema');

const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const Event = require('./models/events');
const User = require('./models/user');
const { makeExecutableSchema } = require('graphql-tools');

app.use(bodyParser.json());

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const graphQlSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    graphiql: true
}));


const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00-w8nxe.mongodb.net:27017,cluster0-shard-00-01-w8nxe.mongodb.net:27017,cluster0-shard-00-02-w8nxe.mongodb.net:27017/${process.env.MONGO_DB}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`;
console.log('Info: ', uri)
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.info('Connected to DB')
        app.listen(3000);
    })
    .catch(err => {
        console.error(err)
    });

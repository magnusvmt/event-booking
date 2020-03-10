import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose';
import graphqlTools from 'graphql-tools'

import typeDefs from './graphql/schema.mjs';
import resolvers from './graphql/resolvers.mjs';

const app = express();

app.use(bodyParser.json());

const { makeExecutableSchema } = graphqlTools;
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

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const Event = require('./models/events');
const User = require('./models/user')

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
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

        type RootQuery {
          events: [Event!]!
        }

        type RootMutation {
          createEvent(eventInput: EventInput): Event
          createUser(userInput: UserInput): User
        }

        schema {
          query: RootQuery
          mutation: RootMutation
        }

    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc, _id: event.id };
                    });
                })
                .catch(err => {
                    throw err;
                });
        },
        createEvent: (args) => {
            console.log('im here')
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event
                .save()
                .then(result => {
                    console.log(result);
                    return { ...result._doc, _id: event.id };
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createUser: args => {
            return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user){
                    throw new Error('User exists already');
                }
                return bcrypt.hash(args.userInput.password, 12);
            })
            .then(hashedPass => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPass
                });
                return user.save();
            })
            .then(result => {
                return { ...result._doc, _id: result.id, password: null }
            })
            .catch( err => {
                throw err;
            });
            
        }
    },
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

import Event from '../models/events.mjs';
import User from '../models/user.mjs';
import bcrypt from 'bcryptjs';

const resolvers = {
    Query: {
        events: (_, { id })  => {
            return Event.find(id)
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc, _id: event.id };
                    });
                })
                .catch(err => {
                    throw err;
                });
        }
    },
    Mutation: {
        createEvent: (_, {eventInput}) => {
            console.log('im here')
            const event = new Event({
                title: eventInput.title,
                description: eventInput.description,
                price: +eventInput.price,
                date: new Date(eventInput.date)
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
        createUser: (_, {userInput})  => {
            return User.findOne({ email: userInput.email })
            .then(user => {
                if (user){
                    throw new Error('User exists already');
                }
                return bcrypt.hash(userInput.password, 12);
            })
            .then(hashedPass => {
                const user = new User({
                    email: userInput.email,
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
    Event: {
        
    },
    User: {

    }
};

export default resolvers;
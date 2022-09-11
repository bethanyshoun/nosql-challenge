const { Schema, model } = require('mongoose');
//validator for email
//const validator = require('validator');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    // Must match a valid email address (look into Mongoose's matching validation)
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/]
    },
    // Array of _id values referencing the Thought model
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    // Array of _id values referencing the User model (self-reference)
    friends: [/*UserSchema*/],
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
 }
);

// Create a virtual called friendCount that retrieves the length of the user's friends array field on query.
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

//create User model
const User = model('User', UserSchema);

module.exports = User;



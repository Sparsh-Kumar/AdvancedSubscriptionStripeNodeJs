

const mongoose = require ('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');
const path = require ('path');
const { Plan } = require  (path.resolve (__dirname, 'Plan'));

const UserSchema = new mongoose.Schema ({

    customerId: {
        type: String,
        trim: true,
        required: true
    },

    nickname: {
        type: String,
        trim: true,
        required: true,
    },

    name: {
        type: String,
        trim: true,
        required: true,
    },

    picture: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate: {
            validator: (email) => {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test (email);
            },
            message: '{VALUE} is not a valid email'
        }
    },

    email_verified: {
        type: Boolean,
        required: true,
        default: false
    },

    sub: {
        type: String,
        trim: true,
        required: true,
    },

    subscribedPlan: {
        type: mongoose.Types.ObjectId,
        ref: 'plan',
        default: null
    },

}, { timestamps: true });

UserSchema.plugin (uniqueValidator);

const User = mongoose.model ('user', UserSchema, 'users');
module.exports = {
    User
}
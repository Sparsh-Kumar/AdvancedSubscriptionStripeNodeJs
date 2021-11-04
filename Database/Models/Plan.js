


const mongoose = require ('mongoose');
const path = require ('path');
const uniqueValidator = require ('mongoose-unique-validator');
const { User } = require (path.resolve (__dirname, 'User'));

const planSchema = new mongoose.Schema ({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },

    planId: {
        type: String,
        trim: true,
        required: true,
    },

    pricingId: {
        type: String,
        trim: true,
        required: true
    },

    planType: {
        type: String,
        trim: true,
        required: true
    },

    trialStartDate: {
        type: Date,
        default: null
    },

    trialEndDate: {
        type: Date,
        default: null
    },

    cancelled: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

planSchema.plugin (uniqueValidator);

const Plan = mongoose.model ('plan', planSchema, 'plans');

module.exports = {
    Plan
}
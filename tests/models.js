// import mongoose, { Schema } from 'mongoose'
const mongoose = require('mongoose')
const { Schema } = mongoose

const SymptonsSchema = new Schema({
    cough: { type: Boolean, default: false },
    smellAndTasteImpairment: { type: Boolean, default: false },
    fever: { type: Boolean, default: false },
    breathingDifficulties: { type: Boolean, default: false },
    bodyAches: { type: Boolean, default: false },
    headAches: { type: Boolean, default: false },
    fatigue: { type: Boolean, default: false },
    soreThroat: { type: Boolean, default: false },
    diarrhea: { type: Boolean, default: false },
    runnyNose: { type: Boolean, default: false }
})

const HealthDetailsSchema = new Schema({
    temperature: {
        type: Number,
        min: 10,
        max: 60,
        required: true
    },
    symptons: {
        type: SymptonsSchema,
        required: true,
        default: {
            cough: false,
            smellAndTasteImpairment: false,
            fever: false,
            breathingDifficulties: false,
            bodyAches: false,
            headAches: false,
            fatigue: false,
            soreThroat: false,
            diarrhea: false,
            runnyNose: false
        },
    },
    contactWithin14Days: { type: Boolean, default: false, required: true },
}, {
    timestamps: {
        createdAt: 'createdDateTime'
    }
})

const UserSchema = new Schema({
    fullname: { type: String, trim: true, required: true },
    nric: { 
        type: String, 
        trim: true, 
        uppercase: true,
        minLength: 9,
        maxLength: 9,
        required: true 
    },
    phone: {
        type: String,
        validate: {
          validator: function(value) {
            // Regular expression to match strings containing '+' and digits, allowing spaces
            const phoneRegex = /^[+\d\s]+$/;
            return phoneRegex.test(value);
          },
          message: props => `${props.value} is not a valid phone number.`
        },
        trim: true // Trim white spaces at the edges
    },

    healthDeclarations: [ { type: HealthDetailsSchema } ],
}, { 
    collection: 'users',
    timestamps: {
        createdAt: 'createdDateTime',
        updatedAt: 'lastModifiedDateTime'
    }
})
UserSchema.index({ fullname: 1 })
UserSchema.index({ nric: 1 }, { unique: true })

const User = mongoose.model('User', UserSchema)

module.exports = {
    User
}
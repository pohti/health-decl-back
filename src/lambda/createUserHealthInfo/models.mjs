import mongoose, { Schema } from 'mongoose'

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
        default: null,
    },
    contactWithin14Days: { type: Boolean, required: true },
})

const UserSchema = new Schema({
    fullname: { type: String },
    nric: { type: String },
    phone: { 
        type: String,
        validate: {
            validator: function(value) {
              // Regular expression to match strings containing only '+' and numbers
              const phoneRegex = /^[+\d]+$/;
              return phoneRegex.test(value);
            },
            message: props => `${props.value} is not a valid phone number.`
        }
    },

    healthDetails: {
        type: HealthDetailsSchema,
        default: null,
    },

    createdDateTime: { 
        type: Date,
        required: true,
        default: function() {
            return this.isNew ? new Date() : undefined;
        }
    },
    lastModifiedDateTime: { 
        type: Date, 
        default: new Date() 
    },
}, { collection: 'users' })
UserSchema.index({ fullname: 1 })
UserSchema.index({ nric: 1 }, { unique: true })

export const User = mongoose.model('User', UserSchema)
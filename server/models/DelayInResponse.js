const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldSchema = new Schema({
    label: String,
    type: String,
    required: Boolean,
    maxLength: String,
    deleted: Boolean,
    order: Number,
    _id: String
});

const CompleteProfileFormSchema = new Schema({
    displayAfterSeconds:Number,
    fields: [FieldSchema],
    title: String,
    checked: Boolean
});

const SendMessageToUser = new Schema({
    displayAfterSeconds: Number,
    title: String,
    checked: Boolean
})

const DelayInResponseSchema = new Schema({
    anythingSpecial: Boolean,
    sendMessageToUser: SendMessageToUser,
    completeProfileForm: CompleteProfileFormSchema
});

module.exports = mongoose.model('DelayInResponse', DelayInResponseSchema);

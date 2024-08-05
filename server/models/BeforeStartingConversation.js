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
    fields: [FieldSchema],
    title: String,
    checked: Boolean
});

const BeforeStartingConversationSchema = new Schema({
    anythingSpecial: Boolean,
    completeProfileForm: CompleteProfileFormSchema
});

module.exports = mongoose.model('BeforeStartingConversation', BeforeStartingConversationSchema);

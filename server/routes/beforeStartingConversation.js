// routes/beforeStartingConversation.js
const express = require('express');
const BeforeStartingConversation = require('../models/BeforeStartingConversation');
const router = express.Router();

// Route to initialize form if it does not exist
router.get('/initialize-form', async (req, res) => {
    try {
        let data = await BeforeStartingConversation.findOne();
        if (!data) {
            data = new BeforeStartingConversation({
                anythingSpecial: true,
                completeProfileForm: {
                    fields: [],
                    title: '',
                    checked: false
                }
            });

            await data.save();
            res.status(200).json({ message: 'New form created successfully!', data });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error initializing form:', error);
        res.status(500).json({ message: 'Error initializing form', error });
    }
});

// Backend route to update form data
router.patch('/update-data', async (req, res) => {
    const { anythingSpecial, completeProfileForm } = req.body;

    try {
        const updatedData = await BeforeStartingConversation.findOneAndUpdate(
            { _id: req.body.formId }, // Ensure formId is used here
            {
                anythingSpecial: anythingSpecial,
                completeProfileForm: {
                    ...completeProfileForm,
                    checked: completeProfileForm.checked
                }
            },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'Data updated successfully!', updatedData });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Error updating data', error });
    }
});

// Route to delete a specific field
router.patch('/delete-field/:formId/:fieldId', async (req, res) => {
    const { formId, fieldId } = req.params;

    try {
        const updatedForm = await BeforeStartingConversation.findOneAndUpdate(
            { _id: formId, 'completeProfileForm.fields._id': fieldId },
            { $set: { 'completeProfileForm.fields.$.deleted': true } },
            { new: true }
        );

        if (!updatedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json({ message: 'Field marked as deleted successfully!', updatedForm });
    } catch (error) {
        console.error('Error marking field as deleted:', error);
        res.status(500).json({ message: 'Error marking field as deleted', error });
    }
});

module.exports = router;

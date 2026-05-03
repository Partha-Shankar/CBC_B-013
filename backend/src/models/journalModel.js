import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        moodRating: {
            type: Number,
            min: 1,
            max: 10,
            required: true,
        },
        emoji: {
            type: String,
            default: '😊',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const JournalEntry = mongoose.model('JournalEntry', journalSchema);

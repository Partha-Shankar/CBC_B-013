import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        scores: {
            depression: { type: Number, default: 0 },
            anxiety: { type: Number, default: 0 },
            bipolar: { type: Number, default: 0 },
            schizophrenia: { type: Number, default: 0 },
            ptsd: { type: Number, default: 0 },
        },
        overallRisk: {
            type: String,
            enum: ['low', 'moderate', 'high'],
            default: 'low',
        },
        inputData: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

export const AssessmentHistory = mongoose.model('AssessmentHistory', assessmentSchema);

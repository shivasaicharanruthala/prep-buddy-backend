import mongoose from 'mongoose';

// mongoose schema for available slots
const AvailableSlotsSchema = new mongoose.Schema({
    id: {
      type: String,
        unique: true,
        required: 'id field is required'
    },
    start: {
        type: Date,
        required: 'start time field is required'
    },
    end: {
        type: Date,
        required: 'end time field is required'
    },
    booked: {
        type: Boolean,
        default: false
    }
})

// mongoose schema for mock-interviews
const schema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: 'id field is required'
    },
    userId: {
        type: String,
        required: 'userId field is required'
    },
    interviewedBy: {
        type: String,
    },
    title: {
        type: String,
        required: 'title field is required'
    },
    company: {
        type: String,
        required: 'company field is required'
    },
    role: {
        type: String,
        required: 'role field is required'
    },
    description: {
        type: String,
        required: 'description field is required'
    },
    resume: {
        type: String,
        required: 'resume field is required'
    },
    availableSlots: {
        type: [AvailableSlotsSchema],
        required: 'availableSlots field is required'
    },
    status: {
        type: String,
        default: 'REQUESTED',
        enum : ['REQUESTED', 'INACTIVE', 'ACCEPTED', 'COMPLETED'],
        required: 'status field is required'
    },
    feedback: {
        type: String,
    },
    feedbackAt: {
        type: Date,
    },
    eventId: {
        type: String,
    }
}, {timestamps: true})


const model = mongoose.model('mockinterviews', schema);

export default model; // export mock-interviews schema.

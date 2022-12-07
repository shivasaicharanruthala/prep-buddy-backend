import mongoose from 'mongoose';


const commentsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: 'id field is required'
    },
    userId: {
        type: String,
        required: 'userId field is required'
    },
    comment: {
        type: String,
        required: 'title field is required'
    },
})

// register the tasks schema using mongoose.
const interview_experience_schema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: 'id field is required'
    },
    userId: {
        type: String,
        required: 'userId field is required'
    },
    title: {
        type: String,
        required: 'title field is required'
    },
    company: {
        type: String,
        required: 'title field is required'
    },
    tags: {
        type: String,
        required: 'tags field is required'
    },
    interviewedDate: {
        type: Date,
        default: Date.now(),
        required: 'interviewedDate field is required'
    },
    applicationProcess: {
        type: String,
        required: 'applicationProcess field is required'
    },
    interviewProcess: {
        type: String,
        required: 'interviewProcess field is required'
    },
    interviewExperience: {
        type: String,
        required: 'interviewExperience field is required'
    },
    upvotes: {
        type: Number,
        default: 0
    },
    comments: {
        type: [commentsSchema],
    }
}, {timestamps: true})


const interview_experience_model = mongoose.model('interview-experiences', interview_experience_schema);

export default interview_experience_model;
import  {v4 as uuidv4} from 'uuid';

// imports service layer functions
import * as interviewExperienceService from "../services/interview-experience-services.js";

// controller to fetch all interview experiences
export const getAllInterviewExperience = async (req, res) => {
    try {
        const tasks = await interviewExperienceService.getAllInterviewExperience(); // call to service layer.

        setResponse(tasks, res, 200)
    } catch (err) {
        console.log(err)
        setError(err, res, 400)
    }
}

// controller to fetch interview experience by Id
export const getInterviewExperience = async (req, res) => {
    let statusCode;

    try {
        const task = await interviewExperienceService.getInterviewExperience(req.params.experienceId);
        if (!task) {
            statusCode = 404;
            throw {"error": `task with id: ${req.params.experienceId} does not exist.`};
        }

        setResponse(task, res, 200)
    } catch (err) {
        setError(err, res, statusCode? statusCode : 400)
    }
}

// controller for creating a new interview experience
export const createInterviewExperience = async (req, res) => {
    try {
        if(new Date(req.body.interviewedDate) > new Date()) {
            throw {"error": `interviewedDate must be in the past!!!`};
        }

        const saveTask = await interviewExperienceService.createInterviewExperience(req.params.userId, {...req.body, id: uuidv4()});

        setResponse(saveTask, res, 201)
    } catch (err) {

        console.log("create error: ", err)

        setError(err, res, 400);
    }
}

// controller for updating a interview experience by Id.
export const updateInterviewExperience = async (req, res) => {
    let statusCode;
    try {

        if(new Date(req.body.interviewedDate) > new Date()) {
            throw {"error": `interviewedDate must be in the past!!!`};
        }

        const saveTask = await interviewExperienceService.updateInterviewExperience(req.params.experienceId, req.body);
        if (!saveTask) {
            statusCode = 404;
            throw {"error": `Entity doesn't exist with task id: ${req.params.experienceId}` };
        }

        setResponse(saveTask, res, 200)
    } catch (err) {
        setError(err, res, statusCode? statusCode: 400)
    }
}

// controller for delete a interview experience by Id
export const deleteInterviewExperience = async (req, res) => {
    let statusCode;
    try {
        const deleteTask = await interviewExperienceService.deleteInterviewExperience(req.params.userId, req.params.experienceId);
        if (deleteTask.deletedCount === 0) {
            statusCode = 404;
            throw {"error": `task with id: ${req.params.experienceId} doesnt not exists.`};
        }

        setResponse(deleteTask, res, 204)
    } catch (err) {
        setError(err, res, statusCode? statusCode: 400)
    }
}

// controller to fetch all interview experience comments
export const getAllInterviewExperienceComment = async(req, res) => {
    try {
        const allComments = await interviewExperienceService.getAllInterviewExperienceComment(req.params.experienceId);
        
        res.status(200).send(allComments)
    } catch (error) {
        res.status(400).send({"message": "Something went wrong!!"})
    }
}

// controller for creating a new interview experience comment
export const createInterviewExperienceComment = async (req, res) => {
    try {   
        const saveTask = await interviewExperienceService.createInterviewExperienceComment(req.params.experienceId, {...req.body, userId: req.params.userId, id: uuidv4()});
        setResponse(saveTask, res, 201)
    } catch (err) {

        console.log("comment error: ", err)
        setError(err, res, 400);
    }
}


// controller for updating a interview experience by experienceId, commentId
export const updateInterviewExperienceComment = async (req, res) => {
    let statusCode;
    try {
        const saveTask = await interviewExperienceService.updateInterviewExperienceComment(req.params.userId, req.params.experienceId, req.params.commentId, req.body.comment);
        if (!saveTask) {
            statusCode = 404;
            throw {"error": `Entity doesn't exist with task id: ${req.params.commentId}` };
        }

        setResponse(saveTask, res, 200)
    } catch (err) {
        setError(err, res, statusCode? statusCode: 400)
    }
}

// controller to delete a interview experience comment by experienceId, commentId
export const deleteInterviewExperienceComment = async (req, res) => {
    let statusCode;
    try {

        const deleteTask = await interviewExperienceService.deleteInterviewExperienceComment(req.params.userId, req.params.experienceId, req.params.commentId);
        const comments = deleteTask ? deleteTask.comments.filter(comment => comment.id === req.params.commentId) : []
        if (comments.length > 0) {
            statusCode = 404;
            throw {"error": `task with id: ${req.params.commentId} doesnt not exists.`};
        }

        setResponse(deleteTask, res, 204)
    } catch (err) {
        setError(err, res, statusCode? statusCode: 400)
    }
}

// controller to update upvotes by Id
export const upvotesInterviewExperience = async (req, res) => {
    let statusCode;
    try {
        const saveTask = await interviewExperienceService.upvotesInterviewExperience(req.params.userId,req.params.experienceId, req.body.upvotes);
        if (!saveTask) {
            statusCode = 404;
            throw {"error": `Entity doesn't exist with task id: ${req.params.experienceId}` };
        }

        setResponse(saveTask, res, 200)
    } catch (err) {
        setError(err, res, statusCode? statusCode: 400)
    }
}


// common function to setResponse and statusCode for each request.
const setResponse = (obj, responses, statusCode) => {
    responses.status(statusCode);
    responses.json(obj);
}

// common function to setError and statusCode for each request in case of failure
const setError = (err, responses, statusCode) => {
    responses.status(statusCode);
    responses.json(err);
}
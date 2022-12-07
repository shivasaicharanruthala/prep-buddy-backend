import InterviewExperience from "../models/interview-experience-models.js";

// create a new Interview Experience.
export const createInterviewExperience = async (userId, interview) => {
   try {
    let newInterviewExperience = {...interview, "userId": userId};
    const newInterview = new InterviewExperience(newInterviewExperience);

    return newInterview.save();
   } catch (error) {
        console.log(error)
   }
}

// getInterviewExperience Method to fetch interviewExperience by Id.
export const getInterviewExperience = async (id) => {
    return await InterviewExperience.findOne({"id": id}).exec();
}

// getAllInterviewExperience Method to fetch all the Experiences.
export const getAllInterviewExperience = async () => {
    return await InterviewExperience.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: 'id',
                pipeline: [
                    {$project: {"_id": 0, firstName: 1, lastName: 1}}
                ],
                as: 'users'
            }
        },
        {
            $unwind: "$users"
        } ,
        {
            $project: {
                "_id": 0,
                "id": 1,
                "userId": 1,
                "name": {$concat: ["$users.firstName", " ", "$users.lastName"]},
                "title": 1,
                "company": 1,
                "interviewedDate":1,
                "applicationProcess":1,
                "interviewProcess":1,
                "interviewExperience":1,
                "upvotes":1,
                "tags": 1,
                "comments":1               
            }
        }
    ]).exec();
}


// update the existing InterviewExperience by Id.
export const updateInterviewExperience = async (id, interview) => {

    let updateInterviewExperience = {"title": interview.title, "company": interview.company, "interviewedDate": interview.interviewedDate,
    "applicationProcess": interview.applicationProcess, "interviewProcess": interview.interviewProcess, "interviewExperience": interview.interviewExperience, "tags": interview.tags};

    return await InterviewExperience.findOneAndUpdate({"id": id}, updateInterviewExperience, {new: true}).exec();
}

// delete the existing InterviewExperience by Id.
export const deleteInterviewExperience = async (userId, experienceId) => {
    return await InterviewExperience.deleteOne({ id: experienceId,  userId: userId}).exec();
}

export const getAllInterviewExperienceComment = async (experienceId) => {
    return await InterviewExperience.find({id: experienceId}).sort({interviewedDate: -1}).exec()
}

// create new Interview Experience comment.
export const createInterviewExperienceComment = async (experienceId, comment) => {
    return await InterviewExperience.findOneAndUpdate({id: experienceId}, { "$push": 
    {"comments": 
        {
            "id": comment.id,
            "userId": comment.userId,
            "comment": comment.comment
        }
    }
}, {new: true}).exec();
}   

// modify the existing InterviewExperienceComment by Id.
export const updateInterviewExperienceComment = async (userId, experienceId, commentId, comment) => {
    return await InterviewExperience.findOneAndUpdate(
        {id: experienceId}, 
        {
            $set: {
                "comments.$[inner].comment": comment
            }
        }, 
        {
            arrayFilters: [{"inner.id" : commentId, "inner.userId": userId}],
            new: true
        }
    ).exec();
}

// delete new Interview Experience comment.
export const deleteInterviewExperienceComment = async (userId, experienceId, commentId) => {
    return await InterviewExperience.findOneAndUpdate(
        {id: experienceId}, 
        { $pull: { comments: { id: commentId, userId:  userId} }}, {new: true}
        ).exec();
}


export const upvotesInterviewExperience = async (userId, experienceId, increment) => {
    return await InterviewExperience.findOneAndUpdate(
        {id: experienceId, userId: {$ne: userId}}, 
        { $inc: { upvotes:  increment ? 1 : -1} }, {new: true}
        ).exec();
}

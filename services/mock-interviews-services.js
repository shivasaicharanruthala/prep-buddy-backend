// imports mock-interviews schema
import MockInterview from "../models/mock-interviews.models.js";

// GetMockInterviewsByFilter Method to fetch all the interviews specific to userId & status filter.
export const GetMockInterviewsByFilter = async (userId, filter) => {
    let search = {}
    if (filter && filter.status) {
        search["status"] = filter.status
    }

    search["userId"] = userId

    return await GetMockInterviewsAggregate(search)
}

// GetMockInterviewByID Method to fetch mock-interview given an ID.
export const GetMockInterviewByID = async (userId, mockInterviewId) => {
    return MockInterview.findOne({userID: userId, mockInterviewId: mockInterviewId}).exec();
}

// RequestMockInterview Method to save mock-interview details requested in DB.
export const RequestMockInterview = async (payload) => {
    const newMockInterview = new MockInterview(payload);

    return newMockInterview.save();
}

// ModifyMockInterview method to update existing mock-interview details for a specific interview ID given.
export const ModifyMockInterview = async (mockInterviewId, payload) => {
    let updateMockInterview = {
        "title": payload.title,
        "description": payload.description,
        "company": payload.company,
        "role": payload.role,
        "availableSlots": payload.availableSlots
    };

    return await MockInterview.findOneAndUpdate({"id": mockInterviewId}, updateMockInterview, {new: true}).exec();
}

// DeleteMockInterview method to delete an  existing mock-interview for a given interview ID.
export const DeleteMockInterview = async (id) => {
    // TODO: validate user to be deleted.
    return await MockInterview.deleteOne({"id": id}).exec();
}

// GetMockInterviewsTaken a method to fetch all mock-interviews for a status filter or interviewedBy.
export const GetMockInterviewsTaken = async (filter) => {
    let search = {}
    if (filter && filter.status && filter.status === "REQUESTED") {
        search["status"] = filter.status
    } else {
        if (filter && filter.interviewedBy) {
            search["interviewedBy"] = filter.interviewedBy
        }

        if (filter && filter.status) {
            search["status"] = filter.status
        }
    }

    // aggregator to fetch user and interviewer details from user collection.
    return await GetMockInterviewsAggregate(search)
}

// GetMockInterviewsAggregate method to join mock-interview collection with user collection and project required fields.
export const GetMockInterviewsAggregate = async (search) => {
    return await MockInterview.aggregate([
        {$match: {...search}},
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: 'id',
                pipeline: [
                    {$project: {"_id": 0, "id": 1, "firstName": 1}}
                ],
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'interviewedBy',
                foreignField: 'id',
                pipeline: [
                    {$project: {"_id": 0, "id": 1, "firstName": 1}}
                ],
                as: 'interviewer'
            }
        }
    ]).exec()
}

// ModifySpecificFields method to modify specific fields of a document when a given document id is matched and returns updated fields.
export const ModifySpecificFields = async (mockInterviewId, payload) => {
    return await MockInterview.findOneAndUpdate({id: mockInterviewId}, {"$set": {...payload}}, {new: true}).exec();
}

// ModifyAvailableSlot method to modify available slots of a document when a given document id is matched and returns updated fields.
export const ModifyAvailableSlot = async (mockInterviewId, slotId, payload) => {
    return await MockInterview.findOneAndUpdate({id: mockInterviewId},
        {
            "$set": {
                "interviewedBy": payload.interviewedBy,
                "status": payload.status,
                "availableSlots.$[outer].booked": true,
            }
        },
        {
            new: true,
            arrayFilters: [
                {"outer.id": slotId},
            ]
        }).exec()
}

// GetUserEvents method to fetch all user events with required status.
export const GetUserEvents = async (userId) => {
    return await MockInterview.aggregate([
        {
            $match: {
                $or: [{status: 'COMPLETED'}, {status: 'ACCEPTED'}], $and: [{
                    $or: [
                        {userId: userId},
                        {interviewedBy: userId}
                    ]
                }]
            }
        },
        {
            $project: {
                "_id": 0, "title": 1, "status": 1, "userId": 1,
                "availableSlots": {
                    $filter: {
                        input: "$availableSlots",
                        as: "slot",
                        cond: {
                            $eq: ["$$slot.booked", true]
                        }
                    }
                }
            }
        },
        {$unwind: "$availableSlots"},
        {
            $project: {
                "title": 1, "status": 1,
                "start": "$availableSlots.end",
                "end": "$availableSlots.end",
            }
        },

    ]).exec()
}

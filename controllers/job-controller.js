import { request, response } from 'express';
import * as contactsService from '../services/todo-service.js'

const setErrorResponse=(error, response, statusCode) =>{ //this is for success response
    console.log(statusCode)
    response.status(statusCode);
    response.json(error);
}

const setSuccessResponse=(obj, response, statusCode) =>{ //this is for success response
    response.status(statusCode);
    response.json(obj)
}

export const post=async(request, response) => {
    let statusCode;
    try{
    const payload=request.body;
    console.log("the payload", request)
    const contact= await contactsService.save(payload);
    statusCode=201;
    setSuccessResponse(contact,response, statusCode);
    }
    catch(error){
        setErrorResponse(error,response, statusCode? statusCode: 400);
    }
}

export const index= async(request, response) => {
    //let statusCode;
    try{
        const jobTitle=request.query.jobTitle;
        const company=request.query.company;
        const jobLink = request.query.jobLink;
        const jobType = request.query.jobType;
        const query={};
        if(jobTitle){
            query.jobTitle=jobTitle;
          
        }
        if(company){
            query.company=company;
        }
        if(jobLink){
            query.jobLink = jobLink;
        }
        if(jobType){
            query.jobType = jobType;
        }
        const contacts=await contactsService.search(query);
        console.log("Log in details ------", contacts)
        setSuccessResponse(contacts,response, 200);
    }
    catch(error){
        setErrorResponse(error,response, 400);
    }
}

export const get = async(request,response) =>{
    let statusCode;

    try{
        const id=request.params.id; //This id is from the URL
        console.log("id: ", id)
        const contact=await contactsService.get(id);
        
        if (!contact) {
            statusCode = 404;
            throw {"error": `task with id: ${id} does not exist.`};
        }
        statusCode=200;
        setSuccessResponse(contact,response, statusCode);
    }
    catch(error){
        setErrorResponse(error,response, statusCode? statusCode: 400);
    }
}


export const update = async(request,response) =>{
    let statusCode;
    try{
        const id=request.params.id;
        const updated={...request.body}; 
        console.log("the updated",request)//cloning it
        updated.id=id;
        const contact=await contactsService.update(updated);
        setSuccessResponse(contact, response,200)
    }
    catch(error){
        setErrorResponse(error,response,statusCode? statusCode: 400);  
    }
}

export const remove = async(request,response) =>{
    try{
        const id=request.params.id; //params gives the parameters
        const contact=await contactsService.remove(id);
        setSuccessResponse({message: `Succesfully Removed ${id}`},response,204); //passing the message and response object
    }
    catch(error){
        setErrorResponse(error,response, 400);
    }
}


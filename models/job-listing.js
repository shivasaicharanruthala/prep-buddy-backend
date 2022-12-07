import mongoose from "mongoose";
//This model follows active method pattern CRUD
const Schema = new mongoose.Schema({
    // jobId:{
    //     type: String,
    //     required:"ID is required"
    // },
    jobTitle:{
        type: String,
        required: "Job Title is required"
    },
    company:{
        type: String,
        required: "Company is required"
    },
    jobLink:{
        type: String,
        required: "Job Link is required"
    },
    jobType:{
        type: String,
        required: "Job Type is required"
    },
   
   
},{timestamps : true}); //will remove the version.schema is an object in mongoose which lets you to structure json document.It is a metadata taht defines the actual data


Schema.virtual('id', () => this._id.toHexString()); //instead of showing .id,we are passig the object.It will create virtual id for the schema
Schema.set('toJSON', {virtuals : true , transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }});

//Create a model from schema
const model=mongoose.model('job-listings', Schema);

export default model; //export model
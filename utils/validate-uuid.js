import { validate as uuidValidate } from 'uuid';

/* Check if string is valid UUID4 format */
export const validateId = (id, param) => {
    if(!uuidValidate(id)) {
        throw ({code: 400, message: `Invalid param ${param}: ${id}`})
    }
}
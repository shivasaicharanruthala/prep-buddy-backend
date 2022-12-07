// validatePayload is function that takes JSON data and list required fields and checks if all fields present in the payload or not.
export const validatePayload = (data, fields) => {
    if (fields.length === 0) {
        throw {code: 400, message: "No fields to check."}
    }

    for (let i = 0; i < fields.length; i++) {
        if (!data[fields[i]]) {
            throw {code: 400, message: `${fields[i]} is missing`}
        }
    }

    return {code: 200, message: "all required fields are in payload"}
}
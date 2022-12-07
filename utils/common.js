// common function to setResponse and statusCode for each request.
export const setResponse = (obj, responses, statusCode) => {
    responses.status(statusCode);
    responses.json(obj);
}

// common function to setError and statusCode for each request in case of failure/.
export const setError = (err, responses, statusCode) => {
    responses.status(statusCode);
    responses.json(err);
}

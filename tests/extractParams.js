

class BadRequestError extends Error {}          // 400 | BAD_REQUEST, BAD_REQUEST_BODY, BAD_REQUEST_PARAMETERS, INVALID_QUERY_PARAMETER
class UnauthorizedError extends Error {}        // 401 | UNAUTHORIZED
class ForbiddenError extends Error {}           // 403 | ACCESS_DENIED
class NotFoundError extends Error {}            // 404 | NOT_FOUND
class TimeoutError extends Error {}             // 406 | 

const extractParams = body => {
    if (!body || Object.keys(body).length === 0) throw new BadRequestError()

    const {
        fullname,
        nric,
        phone,
        healthDetails
    } = body

    if (!fullname && !nric) throw new BadRequestError('Missing both fullname and nric')
    if (!healthDetails) throw new BadRequestError('Missing health details')
    let params = {}
    if (fullname) params['fullname'] = fullname
    if (nric) params['nric'] = nric

    let update = {}
    if (phone) update['$set'] = { phone } 
    if (healthDetails) update = { ...update, $push: { healthDeclarations: healthDetails }}
    return { params, update }
}

module.exports = {
    extractParams,
    BadRequestError,
};
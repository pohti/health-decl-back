import mongoose from 'mongoose'
import { User } from './models.mjs'

const MONGODB_URI = process.env.MONGODB_URI

class BadRequestError extends Error {}          // 400 | BAD_REQUEST, BAD_REQUEST_BODY, BAD_REQUEST_PARAMETERS, INVALID_QUERY_PARAMETER
class UnauthorizedError extends Error {}        // 401 | UNAUTHORIZED
class ForbiddenError extends Error {}           // 403 | ACCESS_DENIED
class NotFoundError extends Error {}            // 404 | NOT_FOUND
class TimeoutError extends Error {}             // 406 | 


const validateBody = body => {
    if (!body || Object.keys(body).length === 0) throw new BadRequestError()
}

const insertUser = async body => {
    
    let userData
    try {
        const newUser = User(body)
        await newUser.validate()
        userData = await newUser.save()
    }
    catch (error) {
        throw new BadRequestError('Failed to create user')
    }
    
    console.log('response', userData.toJSON())
    
    return userData.toJSON()
}

export const handler = async (event) => {
    console.log('event', JSON.stringify(event))
    // const queryParams = event.queryStringParameters
    // const pathParams = event.pathParameters
    const body = JSON.parse(event.body)
    console.log('body', body)

    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': true
        }
    }

    try {
        validateBody(body)
        
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
        const userData = await insertUser(body)

        // IMPLEMENTATION HERE
        response = {
            ...response,
            statusCode: 200,
            body: JSON.stringify(userData),
        };
    }
    catch (eInfo) {
        console.error(eInfo)
        let errorResponse = {
            code: 500
        }
        if (eInfo instanceof BadRequestError) {
            response.statusCode         = 400
            errorResponse.code          = 'BAD_REQUEST'
            errorResponse['message']    = eInfo.message
        } else if (eInfo.code === 11000 || eInfo.code === 11001) {
            response.statusCode         = 400
            errorResponse.code          = 'BAD_REQUEST'
            errorResponse['message']    = 'Duplicate field error'
        } else if (eInfo instanceof UnauthorizedError) {
            response.statusCode         = 401
            errorResponse.code          = 'UNAUTHORIZED'
        } else if (eInfo instanceof ForbiddenError) {
            response.statusCode     = 403
            errorResponse.code      = 'ACCESS_DENIED'
        } else if (eInfo instanceof NotFoundError) {
            response.statusCode     = 404
            errorResponse.code      = 'NOT_FOUND'
            errorResponse.message   = eInfo.message
        } else if (eInfo instanceof TimeoutError) {
            response.statusCode     = 406
            errorResponse.code      = 'Timeout'
        } else {
            response.statusCode     = 500
            errorResponse.code      = 'INTERNAL_SERVER_ERROR'
        }
        response = {
            ...response,
            body: JSON.stringify({ error: errorResponse })
        }
        // console.error(response)
    }
    finally {
        await mongoose.disconnect()
        return response
    }
};
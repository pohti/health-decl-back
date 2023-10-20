import mongoose from 'mongoose'
import { User } from 'models.mjs'

const MONGODB_URI = process.env.MONGODB_URI

class BadRequestError extends Error {}          // 400 | BAD_REQUEST, BAD_REQUEST_BODY, BAD_REQUEST_PARAMETERS, INVALID_QUERY_PARAMETER
class UnauthorizedError extends Error {}        // 401 | UNAUTHORIZED
class ForbiddenError extends Error {}           // 403 | ACCESS_DENIED
class NotFoundError extends Error {}            // 404 | NOT_FOUND
class TimeoutError extends Error {}             // 406 | 



export const handler = async (event) => {
    console.log('event', JSON.stringify(event))
    // const queryParams = event.queryStringParameters
    // const pathParams = event.pathParameters
    // const body = JSON.parse(event.body)

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
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

        // IMPLEMENTATION HERE
        response = {
            ...response,
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!'),
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
        }
        else {
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
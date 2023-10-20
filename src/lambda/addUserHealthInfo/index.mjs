import mongoose from 'mongoose'
import { User } from './models.mjs'

const MONGODB_URI = process.env.MONGODB_URI

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
        healthDetails
    } = body

    if (!fullname && !nric) throw new BadRequestError('Missing both fullname and nric')
    if (!healthDetails) throw new BadRequestError('Missing health details')
    let params = {}
    if (fullname) params['fullname'] = fullname
    if (nric) params['nric'] = nric
    return { params, healthDetails }
}

const addHealthInfo = async (params, healthDetails) => {
    console.log('update params', { params, healthDetails })
    const mongoResponse = await User.updateOne(
        params,
        { $push: { healthDeclarations: healthDetails } }
    )
    

    console.log('mongoResponse', mongoResponse)
    if (!mongoResponse.acknowledged) throw new Error('Failed to update')
    
}

export const handler = async (event) => {
    console.log('event', JSON.stringify(event))
    // const queryParams = event.queryStringParameters
    // const pathParams = event.pathParameters
    const body = JSON.parse(event.body)
    // console.log('body', body)
    
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
        const { params, healthDetails } = extractParams(body)

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
        await addHealthInfo(params, healthDetails)

        // IMPLEMENTATION HERE
        response = {
            ...response,
            statusCode: 200,
            body: JSON.stringify('Updated successfully!'),
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
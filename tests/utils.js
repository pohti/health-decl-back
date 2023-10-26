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


module.exports = extractParams;
const { User } = require('./models.js')

const addHealthInfo = async (params, update) => {
    const mongoResponse = await User.updateOne(
        params,
        update,
        { upsert: true }
    )
    
    // console.log('mongoResponse', mongoResponse)
    if (!mongoResponse.acknowledged) throw new Error('Failed to update')
    if (mongoResponse.modifiedCount !== 1 && mongoResponse.upsertedCount !== 1) throw new Error('Failed to create/update!')
}

module.exports = { addHealthInfo }
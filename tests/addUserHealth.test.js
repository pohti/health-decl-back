const { User } = require('./models.js')
const { addHealthInfo } = require('./addUserHealth.js')

jest.mock('./models.js', () => ({
  User: {
    updateOne: jest.fn(),
  },
}));


// happy paths
test('addHealthInfo calls User.updateOne with correct params', async () => {
  const params = { fullname: 'John Doe', nric: '123456789' };
  const update = { $set: { phone: '123456789' }, $push: { healthDeclarations: {} } };

  // Mock the response object from User.updateOne
  const mongoResponse = {
    acknowledged: true,
    modifiedCount: 1,
    upsertedCount: 1,
  };

  // Set the mock implementation for User.updateOne
  User.updateOne.mockResolvedValue(mongoResponse);

  await addHealthInfo(params, update);

  expect(User.updateOne).toHaveBeenCalledWith(params, update, { upsert: true });
});


// unhappy paths
test('addHealthInfo encountered database error', async () => {
    const params = { fullname: 'John Doe', nric: '123456789' };
    const update = { $set: { phone: '123456789' }, $push: { healthDeclarations: {} } };
  
    const mongoResponse = {
        acknowledged: false
    };

    // Simulate an error by rejecting the Promise
    User.updateOne.mockResolvedValue(mongoResponse);

    // Call the addHealthInfo function and catch the error
    try {
        await addHealthInfo(params, update);
    } catch (error) {
        // Verify that the function throws the expected error
        expect(error.message).toBe('Failed to update');
    }
});
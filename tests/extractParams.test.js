
const { extractParams, BadRequestError } = require('./extractParams.js');


// happy paths
test('Should be able to extract params and health details', () => {
    const userData = {
        "fullname": "Alice Tan",
        "nric": "G4444333L",
        "phone": "+65 12345673",
        "healthDetails": {
          "temperature": 37.5,
          "symptons": {
            "cough": true,
            "smellAndTasteImpairment": false,
            "fever": true,
            "breathingDifficulties": false,
            "bodyAches": true,
            "headAches": false,
            "fatigue": false,
            "soreThroat": false,
            "diarrhea": false,
            "runnyNose": false
          },
          "contactWithin14Days": false
        }
    }
    const expectedParams = {
        "fullname": "Alice Tan",
        "nric": "G4444333L",
    }
    const expectedUpdate = {
      $set: { phone: "+65 12345673" },
      $push: {
        healthDeclarations: {
          "temperature": 37.5,
          "symptons": {
            "cough": true,
            "smellAndTasteImpairment": false,
            "fever": true,
            "breathingDifficulties": false,
            "bodyAches": true,
            "headAches": false,
            "fatigue": false,
            "soreThroat": false,
            "diarrhea": false,
            "runnyNose": false
          },
          "contactWithin14Days": false
        }
      }
    }

    const extractedParams = extractParams(userData)

    expect(extractedParams).toStrictEqual({
        params: expectedParams,
        update: expectedUpdate
    })
}) 


// unhappy paths
test('extractParams throws BadRequestError for empty body', () => {
  expect(() => {
    extractParams({});
  }).toThrow(BadRequestError);
});

test('extractParams throws BadRequestError for missing fullname and nric', () => {
  expect(() => {
    extractParams({ phone: '123456789', healthDetails: {} });
  }).toThrow(BadRequestError);
});

test('extractParams throws BadRequestError for missing healthDetails', () => {
  expect(() => {
    extractParams({
      fullname: 'John Smith', 
      nric: 'G1234123L', 
      phone: '+65 12345678'
    }).toThrow(BadRequestError)
  })
})
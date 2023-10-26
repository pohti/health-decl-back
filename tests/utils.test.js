const extractParams = require('./utils');


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
    const expectedHealthData = {
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

    expect(extractParams(userData)).toBe({
        params: expectedParams,
        healthDetails: expectedHealthData
    })
}) 




// unhappy paths
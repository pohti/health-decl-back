const extractParams = require('./utils');

const userData = {
    fullname: 'Alice Tan',
    nric: 'G4444333L',
    phone: '+65 12345673',
    healthDetails: {
      temperature: 37.5,
      symptons: {
        cough: true,
        smellAndTasteImpairment: false,
        fever: true,
        breathingDifficulties: false,
        bodyAches: true,
        headAches: false,
        fatigue: false,
        soreThroat: false,
        diarrhea: false,
        runnyNose: false
      },
      contactWithin14Days: false
    }
}

console.log(userData, extractParams(userData))
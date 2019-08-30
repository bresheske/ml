/**
 * this solution runs forever (until control-c is pressed) and slightly mutates
 * the current model depending on its current level of correctness.
 */


/**
 * estimates how much a house is worth based on the current model.
 */
function estimateWorth(beds, baths, sqft, model) {
    let price = 0;
    price += beds * model[0];
    price += baths * model[1];
    price += sqft * model[2];
    price += model[3];
    return price;
};

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * mutates the model based on the current percent error of the model.
 *
 * this returns a copy of the model, and doesn't edit it in-line.
 */
function mutateModel(model, percentError) {
    const numTimes = Math.floor(Math.random() * Math.floor(1000));
    const newModel = [...model];
    for (let i = 0; i < numTimes; i++) {
        const randomIndex = Math.floor(Math.random() * Math.floor(4));
        const plusOrMinus = Math.floor(Math.random() * Math.floor(2));
        
        const maxDiff = newModel[randomIndex] * (percentError / 100);
        const diff = getRandomFloat(0, maxDiff);
        const newWeight = plusOrMinus === 1
            ? newModel[randomIndex] + diff
            : newModel[randomIndex] - diff;
    
        
        newModel[randomIndex] = newWeight;
    }
    return newModel;
}

const fs = require('fs');
const EOL = require('os').EOL;

// pull in the training set of factual data.
const factData = fs.readFileSync('trainingdata.txt')
    .toString()
    .split(EOL)
    .map(line => {
        const split = line.split(',');
        return { beds: parseInt(split[0]), baths: parseInt(split[1]), sqft: parseInt(split[2]), price: parseInt(split[3]) };
    });

// now we have an array of objects of factual data.
// best model: 8389.584940757095,13661.15954840756,54.124649654900864,42685.69750605658, %Error: 2.1728488592509168
// set these to 0 to re-run the training.
let currentModel = [
    8389.584940757095,
    13661.15954840756,
    54.124649654900864,
    42685.69750605658
];
let currentPercentError = Number.MAX_SAFE_INTEGER;
let bestModel = [...currentModel];
let bestPercentError = Number.MAX_SAFE_INTEGER;
while (true) {
    const errors = [];
    for (const factRow of factData) {
        const result = estimateWorth(factRow.beds, factRow.baths, factRow.sqft, currentModel);
        const diff = Math.abs(result - factRow.price);
        const percentError = diff / factRow.price * 100;
        errors.push(percentError);
    }
    currentPercentError = errors.reduce((sum, el) => sum + el, 0) / errors.length;
    if (currentPercentError < bestPercentError) {
        bestModel = [...currentModel];
        bestPercentError = currentPercentError;
        console.log(`Best Model: ${bestModel}, %Error: ${bestPercentError}`);
    }
    else {
        currentModel = [...bestModel];
        currentPercentError = bestPercentError;
    }
    currentModel = mutateModel(currentModel, currentPercentError);
}

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
 * the lower the percent error, the less we're going to mutate it.
 *
 * this returns a copy of the model, and doesn't edit it in-line.
 */
function mutateModel(model, percentError) {
    const randomIndex = Math.floor(Math.random() * Math.floor(4));
    const plusOrMinus = Math.floor(Math.random() * Math.floor(2));
    
    const maxDiff = model[randomIndex] * (percentError / 100);
    const diff = getRandomFloat(0, maxDiff);
    const newWeight = plusOrMinus === 1
        ? model[randomIndex] + diff
        : model[randomIndex] - diff;

    const newModel = [...model];
    newModel[randomIndex] = newWeight;
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
// best model: 860.6555896104476,1190.4378785819245,71.97341409171561,65181.14025248281, %Error: 4.382799799962669
// set these to 0 to re-run the training.
let currentModel = [
    860.6555896104476,
    1190.4378785819245,
    71.97341409171561,
    65181.14025248281
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

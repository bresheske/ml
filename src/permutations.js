/**
 * this solution attempts to produce all of the possible models between a 
 * 'min', 'max', 'step', and 'numWeights'. This is very expensive.
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

function generateNumbers(min, max, step) {
    const result = [];
    let current = min;
    while (current <= max) {
        result.push(current);
        current += step;
    }
    return result;
}

/**
 * basically just generates numbers for all of the number of weights you need.
 * this can be pretty heavy with 4 weights.
 */
function generateModels(min, max, step, numWeights) {
    const values = generateNumbers(min, max, step);

    // https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
    // seriously this is machine learning, whoever would have thought _MATH_ would be involved???
    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
    
    const perms = [];
    for (let i = 0; i < numWeights; i++) {
        perms.push(values);
    }
    return cartesian(...perms);
}

const fs = require('fs');
const EOL = require('os').EOL;

// current model:
// 0,0,100,1500,11.045% error.
// the problem is that we don't want to run this all in memory.
// will require a refactor.
const models = generateModels(0, 1000, 50, 4);

// pull in the training set of factual data.
const factData = fs.readFileSync('trainingdata.txt')
    .toString()
    .split(EOL)
    .map(line => {
        const split = line.split(',');
        return { beds: parseInt(split[0]), baths: parseInt(split[1]), sqft: parseInt(split[2]), price: parseInt(split[3]) };
    });

// now we have an array of objects of factual data.
const results = [];
for (const model of models) {
    const correctness = [];
    for (const factRow of factData) {
        // run the model.
        const result = estimateWorth(factRow.beds, factRow.baths, factRow.sqft, model);
        const diff = Math.abs(result - factRow.price);
        const correct = diff / factRow.price * 100;
        correctness.push(correct);
    }
    const averageCorrectness = correctness.reduce((sum, el) => sum + el, 0) / correctness.length;
    results.push([model[0], model[1], model[2], model[3], averageCorrectness]);
}
// sort by correctness.
results.sort((a, b) => {
    if (a[4] > b[4])
        return 1;
    else if (a[4] < b[4])
        return -1;
    else
        return 0;
});
// print out results.
const lines = results
    .slice(0, 5)
    .map(line => line.join(','))
    .join(EOL);
fs.writeFileSync('results.txt', lines);
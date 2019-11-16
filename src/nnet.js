/**
 * trains a neural network, saves it, and allows input to execute
 * for a single run.
 * 
 * Usage:
 *   To run once:
 *   node src/nnet <beds> <baths> <sqft>
 * 
 *   To print % error:
 *   node src/nnet
 */

const brain = require('brain.js');
const fs = require('fs');
const eol = require('os').EOL;

// for training
const MAX_BEDROOMS = 5;
const MAX_BATHROOMS = 5;
const MAX_SQFT = 5000;
const MAX_PRICE = 400000;
// note - we keep these maxes to convert out input into something
// a neural network can comprehend.  meaning, between 0 and 1.

const trainingNet = new brain.NeuralNetwork();
const lines = fs.readFileSync('./trainingdata.txt')
    .toString()
    .split(eol);
const data = lines.map(line => {
    const cols = line.split(',');
    return {
        bedrooms: parseInt(cols[0]) / MAX_BEDROOMS,
        bathrooms: parseInt(cols[1]) / MAX_BATHROOMS,
        sqft: parseInt(cols[2]) / MAX_SQFT,
        price: parseInt(cols[3]) / MAX_PRICE
    };
});

const trainingdata = data.map(row => {
    const input = {...row};
    delete input.price;
    const output = {price: row.price};
    return {input, output};
});

// if we don't have a nnet.json file defined, we'll create a new
// network and train it first.
if (!fs.existsSync('./nnet.json')) {
    trainingNet.train(trainingdata, {iterations: 200000000, errorThresh: 0.0001, learningRate: 0.8});
    fs.writeFileSync('nnet.json', JSON.stringify(trainingNet.toJSON(), null, 2));
}

const net = new brain.NeuralNetwork().fromJSON(JSON.parse(fs.readFileSync('./nnet.json')));
const args = process.argv.slice(2);

if (args[0]) {
    // if the user specified a single-run
    const beds = parseInt(args[0]);
    const baths = parseInt(args[1]);
    const sqft = parseInt(args[2]);
    const input = { bedrooms: beds / MAX_BEDROOMS, bathrooms: baths / MAX_BATHROOMS, sqft: sqft / MAX_SQFT };
    const output = net.run(input);
    console.log(output.price * MAX_PRICE);
}
else {
    // if no input, we want to re-run the training data and show % error.
    const errors = [];
    for (const data of trainingdata) {
        const price = net.run(data.input).price * MAX_PRICE;
        const expected = data.output.price * MAX_PRICE;
        const percentError = (Math.abs(price - expected)) / expected;
        errors.push(percentError);
    }
    const averageError = errors.reduce((t, c) => t + c, 0) / errors.length * 100;
    console.log('errors: ', errors);
    console.log(`average error: ${averageError.toFixed(2)}%`);
}
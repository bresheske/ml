/**
 * just run a single estimation after a model is created.
 * this reads the current model in ./bestModel.json, which needs to be edited manually.
 * use like this:
 * 
 * node src/run <beds> <baths> <sqft>
 */

const model = require('../bestModel.json');
function estimateWorth(beds, baths, sqft) {
    let price = 0;
    price += beds * model[0];
    price += baths * model[1];
    price += sqft * model[2];
    price += model[3];
    return price;
};

const args = process.argv.slice(2);
const beds = parseInt(args[0]);
const baths = parseInt(args[1]);
const sqft = parseInt(args[2]);

const estimation = estimateWorth(beds, baths, sqft);
console.log(`$${estimation.toFixed(2)}`);
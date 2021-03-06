# ML
a very small machine learning expirement

Based on this discussion: 
https://medium.com/@ageitgey/machine-learning-is-fun-80ea3ec3c471

## Method
Using zillow, I dug up some data from some properties around my own home. I used numBeds, numBaths, Sqft, and Actual price (or zillow estimated price).  Using some model mutators, I was able to create 4 weights (including a random salt) to build a model with around 2.2% error, which is pretty good.

Note these prices are pretty specific to my own area. No idea what will turn up in other areas.

## Running With Simple Weights

To estimate a home's worth: `node src/run <beds> <baths> <sqft>`

To train a model using the mutation algorithm: `node src/mutation`

To train a model using the wild mutation algorithm: `node src/wildMutation`

**Note:** I was able to find about a 4% error using the `mutation` algorithm, and then after feeding that into the `wildMutation` algorithm, I was able to refine it to around 2.2% error.

**More Notes:** The 'mutation' and 'wildMutation' algorithms are functions I totally made up. Nothing special to see there. Feel free to tear them apart.

## Running With a Neural Network

Note: `npm i` first.

To train a neural network: `node src/nnet`

To run the network: `node src/nnet <beds> <baths> <sqft>`

The current neural network comes in at around 1.3% error for the trained data. 
# ML
a very small machine learning expirement

Based on this discussion: 
https://medium.com/@ageitgey/machine-learning-is-fun-80ea3ec3c471

This does not use a neural network, but simply uses a model of weights and a way to mutate the current model.

## Method
Using zillow, I dug up some data from some properties around my own home. I used numBeds, numBaths, Sqft, and Actual price (or zillow estimated price).  Using some model mutators, I was able to create 4 weights (including a random salt) to build a model with around 2.2% error, which is pretty good.

Note these prices are pretty specific to my own area. No idea what will turn up in other areas.

## Running

To estimate a home's worth: `node src/run <beds> <baths> <sqft>`

To train a model using the mutation algorithm: `node src/mutation`

To train a model using the wild mutation algorithm: `node src/wildMutation`

**Note:** I was able to find about a 4% error using the `mutation` algorithm, and then after feeding that into the `wildMutation` algorithm, I was able to refine it to around 2.2% error.

**More Notes:** The 'mutation' and 'wildMutation' algorithms are functions I totally made up. Nothing special to see there. Feel free to tear them apart.

# Classification Example

Takes data from Twitter, trains a classifier and evaluates the performanace.

## Setting up

Install dependencies:
```
npm install
```

Export Twitter auth variables:
```
export CONSUMER_KEY=...
export CONSUMER_SECRET=...
export ACCESS_TOKEN=...
export ACCESS_TOKEN_SECRET=...
```

## Running

Get some data from Twitter:
```
node gather.js
```

Train model and predict accuracy:
```
node train.js
```

const { BayesClassifier } = require('natural');
const { readJson } = require('fs-extra');
const { join } = require('path');
const { hashtags, dataPath } = require('./local-constants');

async function main() {
    var data = await loadData(...hashtags);
    var classifier = train(data);
    var results = predict(classifier, data);
    console.log(results)
    var total = results.positives + results.negatives
    var accuracy = results.positives/total;
    var error = (total - results.positives)/total;
    console.log('Accuracy: %f\%', (accuracy*100).toFixed(2))
    console.log('Error: %f\%', (error*100).toFixed(2))
}

async function loadData(...hashtags) {
    var data = [];
    for(var tag of hashtags) {
        var path = join(dataPath, `${tag}.json`);
        var tagData = await readJson(path);
        data = data.concat(tagData.map(e => { e['label'] = tag; return e }));
    }
    return data;
}

function train(data) {
    var classifier = new BayesClassifier();
    for(var tweet of data) {
        classifier.addDocument(tweet.text, tweet.label);
    }
    classifier.train()
    return classifier;
}

function accuracy(classifier, data) {
    const count = data.length;
    const sets = 10;
    const step = Math.ceil(count/sets);

    var results = {
        positives: 0,
        negatives: 0,
    }

    for(var start=0,end=step; start<=count; start=end,end+=step) {
        var trainingSet = data.slice(0, start).concat(data.slice(end));
        var testingSet = data.slice(start, end);

        var classifier = train(trainingSet);
        var setResults = predict(classifier, testingSet);

        results.positives += setResults.positives;
        results.negatives += setResults.negatives;
    }

    return results;
}

function predict(classifier, testingSet) {
    var results = {
        positives: 0,
        negatives: 0,
    }
    for(var tweet of testingSet) {
        var classification = classifier.classify(tweet.text);
        if(classification == tweet.label) {
            results.positives++;
        } else{
            results.negatives++;
        }
    }
    return results;
}

main();

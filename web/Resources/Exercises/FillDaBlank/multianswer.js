/**
 * User: guyman
 * Date: 6/24/14
 * Time: 12:57 AM
 */
function MultiAnswer(elem) {
    Entity.call(this, elem);
    this.__answers__ = [];
    this.__choices__ = [];
    this.__chosenChoice__ = null;
    this.__chosenAnswer__ = null;
    this.__presentUniqueByToken__ = false;
}
MultiAnswer.prototype = Object.create(Entity.prototype);
MultiAnswer.prototype.constructor = MultiAnswer;
MultiAnswer.prototype.load = function (exercise) {
    // create choices based on answers and keep reference of answers
    var uniqueTokens = {};
    for (var i = 0; i < answers.length; i++) {
        var token = answers[i].getToken();
        if (!uniqueTokens.hasOwnProperty(token)) {
            uniqueTokens[token] = [];
        }
        uniqueTokens[token].push(answers[i]);
    }

    for (var token in uniqueTokens) {
        var choice = new Answer(document.createElement('div'));
        choice.setText(token)
            .setAnswers(uniqueTokens[token]);
        this.__choices__.push(choice);
    }

    return this;
};
MultiAnswer.prototype.onSubmit = function(answer) {

};
/*
    Displays the answers to the player.
    The actually displayed entities are subject to change pending the implementation of this object.
 */
MultiAnswer.prototype.present = function (answers) {
    // create choices based on answers and keep reference of answers
    var tokens = {};
    for (var i = 0; i < answers.length; i++) {
        var token = answers[i].getToken();
        if (this.__presentUniqueByToken__) {
            if (!tokens.hasOwnProperty(token)) {
                tokens[token] = [];
            }
        }
        tokens[token].push(answers[i]);
    }

    for (var token in tokens) {
        var choice = new Answer(document.createElement('div'));
        choice.setText(token)
            .setAnswers(tokens[token]);
        this.__choices__.push(choice);
    }
};
MultiAnswer.prototype.__onChoice__ = function (choice) {
    this.fire({
        type:   'answer',
        source: this.__answers__[0] //TODO change to real answer
    });
    return this;
};
/**
 * User: guyman
 * Date: 12/2/13
 * Time: 4:08 PM
 *
 * Entities register to state updated events that receive the gamestate
 * Each queries the state for the desired attributes, and implements it's own logic for rendering the new state
 */

function Game(elem, spec) {
    Visual.call(this, elem, spec);
    this.data = spec.gamedata;
    this.objects = {
        question: new Question(),
        score: new Score(),
        health: new Health(),
        combo: new Combo(),
        progress: new progressBar()
    };
    this.question = null;
    this.questionsComplete = [];
    this.questionsIncomplete = spec.data.questions;
    this.score = null;
    this.health = null;
    this.combo = null;
}
Game.prototype = Object.create(Visual.prototype);
Game.prototype.constructor = Game;
Game.prototype.__handleAnswer = function (answer) {
    if (this.health.amount === 0) {
        // Player is dead - game over
    } else if (this.question.isComplete) {
        var nextQuestion = this.nextUnsolvedQuestion();
        if (!nextQuestion) {
            // Challenge Completed
        }
    }
};
Game.prototype.__setQuestion = function (question) {
    if (this.question === question) {
        return this;
    }
    if (this.question) {
        this.question.off('answer', this.__handleAnswer)
            .remove();
    }
    this.question = question.on('answer', this.__handleAnswer)
        .appendTo(this);
    return this;
};
Game.prototype.start = function () {
    this.__setQuestion(this.questionsIncomplete.first());
};
Game.prototype.pause = function () {
};
Game.prototype.resume = function () {
};
Game.prototype.quit = function () {
};
//Game.prototype.updateScore = function () {
//    var reward = 0;
//    if (this.answer.isCorrect) {
//        reward += this.answer.score;
//        this.score.increment(reward);
//    }
//
//    return this;
//};
//Game.prototype.updateHealth = function () {
//    var damage = 0;
//    if (!this.answer.isCorrect) {
//        damage = this.answer.weight;
//        this.health.hurt(damage);
//    }
//};
//Game.prototype.updateCombo = function () {
//    var prevAnswer = this.submittedAnswers.last();
//    if (!prevAnswer) {
//        return this;
//    }
//    if (!this.answer.isCorrect) {
//        this.combo.reset();
//        return this;
//    }
//    if (prevAnswer.isCorrect) {
//        this.combo.levelUp();
//    }
//    return this;
//};
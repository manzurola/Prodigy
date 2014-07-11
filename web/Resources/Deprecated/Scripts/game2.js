/**
 * User: guyman
 * Date: 12/2/13
 * Time: 4:08 PM
 *
 * Entities register to state updated events that receive the gamestate
 * Each queries the state for the desired attributes, and implements it's own logic for rendering the new state
 */


function GameData() {
    this.challenge;
    this.questions;
    this.settings;

    this.__parsers = {
        challenge: [
            new ChallengeParser()
        ],
        question:  [
            new QuestionParser()
        ],
        settings:  [
            new SettingsParser()
        ]
    };
}
GameData.prototype.load = function (data) {

};

function ChallengeParser(spec) {
    Entity.call(this, spec);
}
ChallengeParser.prototype = Object.create(Entity.prototype);
ChallengeParser.prototype.constructor = ChallengeParser;
ChallengeParser.prototype.parse = function (data) {
    return new Challenge();
};

function Challenge(elem, spec) {
    Visual.call(this, elem, spec);
    this.question = null;
    this.questionsComplete = [];
    this.questionsIncomplete = [];
    this.answer = null;
    this.submittedAnswers = [];
    this.score = null;
    this.health = null;
    this.combo = null;
}
Challenge.prototype = Object.create(Visual.prototype);
Challenge.prototype.constructor = Challenge;
Challenge.prototype.load = function init(challenge) {

};
/**
 *
 * @param event = {
 *                  time: currentTime
 *                  context: question
 *                  target: answer = {
 *                                      id,
 *                                      isCorrect,
 *                                      feedback,
 *                                      weight
 *                                  }
 *              }
 * @private
 */
Challenge.prototype.answerQuestion = function (answer) {
    this.answer = answer;
    this.question.submit(this.answer);

    this.updateScore();
    this.updateHealth();
    this.updateCombo();

    this.submittedAnswers.push(answer);
    this.answer = null;
};
Challenge.prototype.__handleAnswer = function (answer) {
    if (this.question.isComplete || this.submittedAnswers.contains(answer)) {
        // Question completed, do not submit answers OR
        // Answer was previously submitted to question and can not be submitted again
    }
    this.answerQuestion(answer);

    if (this.health.amount === 0) {
        // Player is dead - game over
    } else if (this.question.isComplete) {
        var nextQuestion = this.nextUnsolvedQuestion();
        if (!nextQuestion) {
            // Challenge Completed
        }
    }
};
Challenge.prototype.__handleAnswer = function (answer) {
    if (this.question.isComplete || this.submittedAnswers.contains(answer)) {
        // Question completed, do not submit answers OR
        // Answer was previously submitted to question and can not be submitted again
    }
    this.answerQuestion(answer);

    if (this.health.amount === 0) {
        // Player is dead - game over
    } else if (this.question.isComplete) {
        var nextQuestion = this.nextUnsolvedQuestion();
        if (!nextQuestion) {
            // Challenge Completed
        }
    }
};
Challenge.prototype.updateScore = function () {
    var reward = 0;
    if (this.answer.isCorrect) {
        reward += this.answer.score;
        this.score.increment(reward);
    }

    return this;
};
Challenge.prototype.updateHealth = function () {
    var damage = 0;
    if (!this.answer.isCorrect) {
        damage = this.answer.weight;
        this.health.hurt(damage);
    }
};
Challenge.prototype.updateCombo = function () {
    var prevAnswer = this.submittedAnswers.last();
    if (!prevAnswer) {
        return this;
    }
    if (!this.answer.isCorrect) {
        this.combo.reset();
        return this;
    }
    if (prevAnswer.isCorrect) {
        this.combo.levelUp();
    }
    return this;
};
Challegne.prototype.nextUnsolvedQuestion = function () {
    return null;
};
Challenge.prototype.__setQuestion = function (question) {
    if (this.question == question) {
        return this;
    }
    if (this.question) {
        this.question.off('answer', this.answerQuestion)
            .remove();
    }
    this.question = question.on('answer', this.answerQuestion)
        .appendTo(this)
    return this;
};
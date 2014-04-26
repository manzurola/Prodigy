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
    this.challenge = {};
    this.question = {};
    this.blank = {};
    this.choice = {};
    this.health = {};
    this.score = {};
    this.combo = {};
    this.time = {};

    this.__questions = [];
    this.__player = null;
    this.__clock = null;
    this.__level = null;
}
Game.events = {
    MOUSE_ON : 0,
    MOUSE_OFF : 1,
    MOUSE_DOWN : 2,
    MOUSE_UP : 3,
    WORD_DRAG : 3,
    WORD_DROP : 3,
    WORD_MOVE : 4,
    WORD_ADDED : 5,
    WORD_REMOVED : 6,
    BLANK_FILLED : 7,
    BLANK_CLEARED : 8,
    EVALUATE_ANSWER : 7,
    ANSWER_CORRECT : 8,
    ANSWER_MISTAKE : 9,
    HEALTH_HURT : 10,
    HEALTH_HEAL : 11,
    SCORE_UP : 12,
    SCORE_DOWN : 13,
    COMBO_UP : 14,
    COMBO_LOOSE : 15,
    SENTENCE_CORRECT : 0,
    SENTENCE_MISTAKE : 1,
    SENTENCE_SHOW : 1,
    SENTENCE_HIDE : 2,
    CHALLENGE_COMPLETED : 16,
    CHALLENGE_FAILED : 17
};
Game.prototype = Object.create(Visual.prototype);
Game.prototype.constructor = Game;
Game.prototype.update = function (choice) {
    //  update game state according to submitted answer
    var challenge = this.__questions[choice.challenge()]
        .update(choice);

    if (challenge.isIdle()) {
        return;
    }

    var points = challenge.hitpoints();
    points -= 1;
    challenge.hitpoints(points);
    if (challenge.isCorrect()) {
        this.__player.score.add(1);
        this.__player.combo.up();
    } else if (challenge.isMistake()) {
        this.__player.health.hurt(-1);
        this.__player.combo.reset();
    }

    if (challenge.isComplete()) {

    }

    if (challenge.) {
        switch (challenge.state()) {
            case Challenge.states.IDLE:
                this.handleChallengeIdle(challenge);
                break;
            case Challenge.states.CORRECT:
                this.handleChallengeCorrect(challenge);
                break;
            case Challenge.states.MISTAKE:
                this.handleChallengeMistake(challenge);
                break;
            case Challenge.states.SOLVED:
                this.handleChallengeSolved(challenge);
                break;
            case Challenge.states.FAILED:
                this.handleChallengeFailed(challenge);
                break;
        }
    }

    var result = challenge.submit(choice);
    if (!result) {
        return;
    }
    if (result.isCorrect) {
        this.__player.score.add(result.score);
        challenge
    } else {
        this.__player.health.hurt(result.hitpoints);
        if (result.attempts) {

        }
    }
};
Game.prototype.handleBlank = function (blank) {
    this.blank.unFocus();
    this.blank = blank.focus();
};
Game.prototype.handleQuestion = function (question) {
    this.question = question;
};
Game.prototype.handleChoice = function(choice) {
    this.choice = choice;
};
Game.prototype.doChoiceCorrect  = function() {

};
Game.prototype.submitChoice = function (choice) {
    this.choice = choice;
    // Get currently selected blank
    // If blank is solved, return
    // If choice is correct, handle correct answer
    // If choice is false, handle false answer
};
Game.prototype.
    Game.prototype.handleEventChoiceClick = function (choice) {
    // Get currently selected blank
    // If blank is solved, return
    // If choice is correct, handle correct answer
    // If choice is false, handle false answer
};
Game.prototype.onCorrectChoice = function (choice) {
    // Get points remaining at blank
    // Increment player score by points
    // Fill blank with choice
};

Game.prototype.handleChallengeIdle = function (challenge) {
    //Do nothing
};
Game.prototype.handleChallengeCorrect = function (challenge) {

};
Game.prototype.handleChallengeMistake = function (challenge) {

};
Game.prototype.handleChallengeSolved = function (challenge) {

};
Game.prototype.handleChallengeFailed = function (challenge) {

};
Game.prototype.start = function (level, player) {
};
Game.prototype.pause = function () {
};
Game.prototype.resume = function () {
};
Game.prototype.quit = function () {
};

var AUDIO_PLAYER = (function () {
    return {
        play:   function (tagname) {
        },
        pause:  function () {
        },
        resume: function () {
        }
    }
}());

var STYLIST = (function () {

    return {
        decorate: function (domElement, cssClass) {
        },
        strip:    function (domElement, cssClass) {
        }
    }
}());

function ChoicePresenter() {

}
ChoicePresenter.prototype = Object.create(Visual.prototype);
ChoicePresenter.prototype.constructor = ChoicePresenter;
ChoicePresenter.prototype.present = function () {

};
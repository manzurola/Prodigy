/**
 * User: guyman
 * Date: 12/2/13
 * Time: 4:08 PM
 *
 * Entities register to state updated events that receive the gamestate
 * Each queries the state for the desired attributes, and implements it's own logic for rendering the new state
 */

function Answer() {
    this.challenge;
    this.question;
    this.choice;
    this.blank;
    this.score;
    this.attempts;
    this.isCorrect;
    this.feedback;
}

function Blank(elem, spec) {
    Visual.call(this, elem, spec);
    this.attempts = 0;
    this.id = 0;
}
Blank.prototype.focus = function(){

};
Blank.prototype.unfocus = function(){

};
Blank.prototype.putAnswer = function(token) {

};
Blank.prototype.getAnswer = function() {

};
Blank.prototype.clearAnswer = function() {

};




function Challenge(elem, spec) {
    Visual.call(this, elem, spec);
    this.__questions = [];
    this.__player = null;
    this.__clock = null;
    this.__level = null;
}
Challenge.prototype = Object.create(Visual.prototype);
Challenge.prototype.constructor = Challenge;
Challenge.prototype.update = function (choice) {
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

    if (challenge.)
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

    var result = challenge.submit(choice);
    if (!result) {
        return;
    }
    if (result.isCorrect) {
        this.__player.score.add(result.score);
        challenge
    } else {
        this.__player.health.hurt(result.hitpoints);
        if (result.attempts ) {

        }
    }
};
Challenge.prototype.handleEventChoiceSelect = function(event) {

};
Challenge.prototype.handleEventBlankSelect = function(event) {
    // Validate event
    // Get blank from event
    // If player can't focus a different blank then
    //  play appropriate sound, animate and return
    // Else unfocus current blank
    //  play sound, focus new blank
    //  show the choices of the new blank and hide previous ones
    //
    //
};
Challenge.prototype.nextQuestion = function(event){
    // If question is not complete, return
    // Else if no more questions, return
    // Else remove current question and show next one
};
Challenge.prototype.prevQuestion = function(event){

};
Challenge.prototype.submitChoice = function(choice) {

};
Challenge.prototype.focusBlank = function(blank) {

};
Challenge.prototype.selectQuestion = function(question) {

};
Challenge.prototype.onQuestionCompleted = function(question) {

};
Challenge.prototype.makeQuestion = function(data){};
Challenge.prototype.loadQuestion = function(number){};
Challenge.prototype.handleChallengeIdle = function (challenge) {
    //Do nothing
};
Challenge.prototype.handleChallengeCorrect = function (challenge) {

};
Challenge.prototype.handleChallengeMistake = function (challenge) {

};
Challenge.prototype.handleChallengeSolved = function (challenge) {

};
Challenge.prototype.handleChallengeFailed = function (challenge) {

};
Challenge.prototype.start = function (level, player) {
};
Challenge.prototype.pause = function () {
};
Challenge.prototype.resume = function () {
};
Challenge.prototype.quit = function () {
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
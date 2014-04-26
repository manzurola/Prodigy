/**
 * User: guyman
 * Date: 12/2/13
 * Time: 4:08 PM
 *
 */

function Choice(elem, spec) {
    Visual.call(this, elem, spec);
    this.__challengeId = spec.challengeId;
    this.__selected = false;
    this.__submitted = false;
    this.__inner = new Visual(document.createElement('span'), {})
        .decorate('choice-inner');
    this.append(this.__inner)
        .decorate('choice');
}
Choice.prototype = Object.create(Visual.prototype);
Choice.prototype.constructor = Choice;
Choice.prototype.challenge = function () {
    return this.__challengeId;
};
Choice.prototype.selected = function (bool) {
    if (arguments.length > 0) {
        var val = arguments.slice(1);
        this.__selected = bool;
        return this;
    }
    return this.__selected;
};

/**
 *
 * @param elem
 * @param spec hitpoints: the strength of the challenge. Each answer is assigned hitpoints/numOfAnswers amount
 *                          per correct/false submission
 * @constructor
 */
function Challenge(elem, spec) {
    Visual.call(this, elem, spec);
    this.__nextChallengeId = spec.next;
    this.state =
        this.__isIdle = true;
    this.__isMistake = false;
    this.__isCorrect = false;
    this.__isSolved = false;
    this.__isFailed = false;
    this.__mistakeFeedback = '';
    this.__hitpoints = 1;
    this.__mistakes = 0;
    this.__choices = [];
    this.__doUpdate = function () {
    };
}
Challenge.prototype = Object.create(Visual.prototype);
Challenge.prototype.constructor = Challenge;
Challenge.states = {
    IDLE:    0,
    CORRECT: 1,
    MISTAKE: 2,
    SOLVED:  3,
    FAILED:  4
};
Challenge.prototype.next = function () {
    return this.__nextChallengeId;
};
Challenge.prototype.isIdle = function (bool) {
    if (typeof bool === 'boolean') {
        this.__isIdle = bool;
        if (this.__isIdle) {
            this.decorate('idle');
        } else {
            this.strip('idle');
        }
        return this;
    }
    return this.__isIdle;
};
Challenge.prototype.isMistake = function (bool) {
    if (typeof bool === 'boolean') {
        this.__isMistake = bool;
        if (this.__isMistake) {
            this.decorate('attacking');
        } else {
            this.strip('attacking');
        }
        return this;
    }
    return this.__isMistake;
};
Challenge.prototype.isCorrect = function (bool) {
    if (typeof bool === 'boolean') {
        this.__isCorrect = bool;
        if (this.__isCorrect) {
            this.decorate('hurt');
        } else {
            this.strip('hurt');
        }
        return this;
    }
    return this.__isCorrect;
};
Challenge.prototype.isSolved = function (bool) {
    if (typeof bool === 'boolean') {
        this.__isSolved = bool;
        if (this.__isSolved) {
            this.decorate('dead');
        } else {
            this.strip('dead');
        }
        return this;
    }
    return this.__isSolved;
};
Challenge.prototype.isFailed = function (bool) {
    if (typeof bool === 'boolean') {
        this.__isFailed = bool;
        if (this.__isFailed) {
            this.decorate('failed');
        } else {
            this.strip('failed');
        }
        return this;
    }
    return this.__isFailed;
};
Challenge.prototype.isComplete = function () {
    return this.__isFailed || this.__isSolved;
};
Challenge.prototype.feedback = function () {
    return this.__mistakeFeedback;
};
Challenge.prototype.hitpoints = function (points) {
    if (typeof points === 'number') {
        this.__hitpoints = points;
        return this;
    }
    return this.__hitpoints;
};
Challenge.prototype.choices = function () {
    return this.__choices;
};
Challenge.prototype.update = function (choice) {
    this.__doUpdate(choice);
    this.fire('update', this);
};
Challenge.prototype.state = function (state) {
    if (state && Challenge.states.hasOwnProperty(state)) {
        this.state = state;
        return this;
    }
    return this.state;
};

function Goal() {
    this.expression = function () {
    };
    this.instruction = '';
}
Goal.prototype.update = function (player) {

};
Goal.prototype.reached = function () {
    return this.expression();
};
function GoalManager() {

}
GoalManager.update = function (player) {

};

function Reward() {
    var targetGoal = new Goal();
}
Reward.prototype.update = function (player) {
};

function RewardManager() {

}
RewardManager.prototype.update = function (player) {

};

function Health(elem, spec) {
    Visual.call(this, elem, spec);
    this.__healthbar = new ProgressBar(document.createElement('div'), {
        progress: spec.points
    });
    this.decorate('health');
    this.appendChild(this.__healthBarVisual);
}
Health.prototype = Object.create(Visual.prototype);
Health.constructor = Health;
Health.prototype.update = function (player, challenge) {
    //  If mistake
    if (!challenge.isMistake()) {
        //  If player dead
        player.hitpoints -= challenge.hitpoints();
        if (player.hitpoints <= 0) {
        } else {
            this.decorate('hurt');
        }
        this.__healthbar.progress(player.hitpoints);
    }
};
Health.prototype.hurt = function (amount) {
    this.decorate('hurt');
    this.points(this.__healthbar.progress() - amount);
};
Health.prototype.heal = function (amount) {
    this.decorate('heal');
    this.points(this.__healthbar.progress() + amount);
};
Health.prototype.points = function(value) {
    if (Utils.assertArg(arguments, 1, value, 'number')) {
        this.__healthbar.progress(value);
        return this;
    }
    return this.__healthbar.progress();
};


/**
 * Note: Challenges may add properties to this object for private use (e.g. identifying answer by id)
 * @constructor
 */
var Answer = {
    // target
    id:        0,
    // true if the answer is correct, false otherwise
    isCorrect: false,
    // the amount of points granted
    score:     0,
    // the amount lowered/raised from player health on mistake/correct
    hitpoints: 0,
    // times required to reach this answer
    attempts:  0,
    // show the player on correct/mistake
    feedback:  '',
    // true if this was the last answer to submit
    isLast:    false,
    // system time when answer was submitted
    time:      0
};

function Combo() {
    this.count = 0;
}
Combo.prototype.update = function (player) {
    var lastAnswer = player.answers.last();
};

function Score(elem, spec) {
    Visual.call(this, elem, spec);
    this.__pointsVisual = new Visual(document.createElement('div'), {})
        .decorate('points');
    this.__multiplierVisual = new Visual(document.createElement('div'), {})
        .decorate('points');
    this.points = 0;
    this.multiplier = 0;
}
Score.prototype = Object.create(Visual.prototype);
Score.constructor = Score;
Score.prototype.add = function (points) {
};
Score.prototype.raiseMultiplier = function () {
};
Score.prototype.resetMultiplier = function () {
};

function Player(elem, spec) {
    Visual.call(this, spec);
    this.id = '';
    this.score = new Score();
    this.health = new Health();
    this.combo = new Combo();
    this.comboLevel = 0;
    this.atChallenge = 0;
    this.choices = [];
}
Player.prototype = Object.create(Visual.prototype);
Player.constructor = Player;
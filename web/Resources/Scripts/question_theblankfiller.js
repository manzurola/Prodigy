/**
 * User: guyman
 * Date: 12/13/13
 * Time: 1:19 AM
 *
 * TODO: rename to absorber ? (rename blank to VOID?)
 */
function Blank(elem, spec) {
}
Blank.prototype = Object.create(Visual.prototype);
Blank.prototype.constructor = Blank;

function Choice(elem, spec) {
}
Choice.prototype = Object.create(Visual.prototype);
Choice.prototype.constructor = Choice;

function BlankFillerData(rawdata) {
    this.rawdata;
    this.sentence;
    this.blanks;
    this.choices;
}
BlankFillerData.prototype = Object.create(QuestionData.prototype);
BlankFillerData.prototype.constructor = BlankFillerData;
BlankFillerData.prototype.load = function () {
    if (!this.loadSentence()) {
        return false;
    }
    if (!this.loadBlanks()) {
        return false;
    }
    if (!this.loadChoices()) {
        return false;
    }
    return true;
};
BlankFillerData.prototype.loadSentence = function () {
    this.sentence = new Visual({
        element: document.createElement('div')
    }).html(rawdata.sentence)
        .decorate('sentence');
    return true;
};
BlankFillerData.prototype.loadBlanks = function () {
    var rawBlanks = this.rawdata.sentence.element().getElementsByClassName('blank'),
        blanks = [],
        numOfBlanks = rawBlanks.length;

    for (var i = 0; i < numOfBlanks; i++) {
        var elem = rawBlanks[i];
        var blank = new Visual(elem, {})
            .data({
                attempts: 0
            })
            .decorate('empty')
            .text('');
        blanks.push(blank);
    }
    this.blanks = blanks;
    return true;
};
BlankFillerData.prototype.loadChoices = function () {
    var uniqueTokens = {}, choices = [];
    for (var i = 0; i < this.__blanks.length; i++) {
        var blank = this.__blanks[i],
            answers = blank.data('answers'),
            dummies = blank.data('dummies');
        for (var j = 0; j < answers.length; j++) {
            uniqueTokens[answers[j]] = true;
        }
        for (var k = 0; k < dummies.length; k++) {
            uniqueTokens[dummies[k]] = true;
        }
    }
    for (var count = 0; count < uniqueTokens.length; count++) {
        var choice = new Choice({
            element: document.createElement('div')
        }).text(uniqueTokens.pop())
            .decorate('pending');
        choices.push(choice);
    }
    this.choices = choices;
    return true;
};

function BlankFiller(elem, spec) {
    Question.call(this, elem, spec);
    this.__sentence = spec.sentence;
    this.__choices = spec.choices;
    this.__blanks = spec.blanks;

    this.__choiceBox = null;

    this.__blanksComplete = [this.__blanks.length];
    this.blank = 0;
}
BlankFiller.prototype = Object.create(Question.prototype);
BlankFiller.prototype.constructor = BlankFiller;
BlankFiller.prototype.onChoiceClick = function (choice) {
    var blank = this.__blanks[this.blank];
    if (blank.data.isSolved) {
        // Do nothing if current blank is solved
        return this;
    }
    var isCorrect = blank.answers.contains(choice.id());
    if (isCorrect) {
        // Correct Answer
        var child = new Visual(document.createElement('span'), {})
            .decorate('correct')
            .text(choice.token);
        blank.empty()
            .append(child)
            .decorate('correct');
        blank.data.isComplete = true;
    } else {
        // Mistake
        blank.decorate('mistake');
    }

    blank.data.attempts += 1;
    if (blank.data.attempts === this.blank.data.maxAttempts) {
        blank.data.isComplete = true;
    }

    this.__blanksComplete[this.blank] = blank.data.isComplete;
    if (!this.__blanksComplete.contains(false)) {
        // Question completed
        this.complete();
    }
};
BlankFiller.prototype.complete = function () {
    var mistakes;
    for (var i = 0; i < this.__blanks.length; i++) {
        mistakes += this.__blanks[i].data.attempts -1;
    }
    this.answer = {};
    return this.fire('answer');
};
BlankFiller.prototype.onBlankClick = function (blank) {

};
BlankFiller.prototype.complete = function () {
    if (!this.answer) {
        return this;
    }
    var blank = this.__blanks[this.blank];
    if (!this.__blanksIncomplete.contains(blank)) {
        // Blank was already solved
        this.isIdle(true);
        return this;
    }
    this.__answer.hitpoints = 1;
    this.__answer.attempts = blank.data.attempts;
    this.hitpoints(1 / this.__blanks.length);
    blank.empty();
    if (blank.data('answers').contains(choice.token)) {
        //  Solve blank
        blank.append(new Visual(document.createElement('span')), {})
            .text(choice.token)
            .decorate('correct');
        this.isCorrect(true)
            .isMistake(false);
        this.__blanksIncomplete.remove(blank);
        this.__blanksComplete.push(blank);
        if (this.__blanksIncomplete.length === 0) {
            this.isSolved(true);
        }
    } else {
        //  Mistake
        blank.decorate('mistake');
        this.isCorrect(false)
            .isMistake(true)
            .isSolved(false);
    }

    this.fire('update');
    return this;
};
BlankFiller.prototype.submit = function (choice) {
    var blank = this.__blanks[this.blank];
    if (!this.__blanksIncomplete.contains(blank)) {
        // Blank was already solved
        this.isIdle(true);
        return this;
    }
    this.__answer.id = choice.id();
    this.__answer.hitpoints = 1;
    this.__answer.attempts = blank.data.attempts;
    this.hitpoints(1 / this.__blanks.length);
    blank.empty();
    if (blank.data('answers').contains(choice.token)) {
        //  Solve blank
        blank.append(new Visual(document.createElement('span')), {})
            .text(choice.token)
            .decorate('correct');
        this.isCorrect(true)
            .isMistake(false);
        this.__blanksIncomplete.remove(blank);
        this.__blanksComplete.push(blank);
        if (this.__blanksIncomplete.length === 0) {
            this.isSolved(true);
        }
    } else {
        //  Mistake
        blank.decorate('mistake');
        this.isCorrect(false)
            .isMistake(true)
            .isSolved(false);
    }

    this.fire('update');
    return this;
};
BlankFiller.prototype.submit = function (answer) {

    var blank = this.blanks[answer.__blankId];
    var choice = this.choices[answer.__choiceId];

    blank.empty();
    if (answer.isCorrect) {
        //  Solve blank
        blank.append(new Visual(document.createElement('span')), {})
            .text(choice.token)
            .decorate('correct');
        this.__blanksIncomplete.remove(blank);
        this.__blanksComplete.push(blank);
        if (this.__blanksIncomplete.length === 0) {
            this.isSolved(true);
        }
    } else {
        //  Mistake
        blank.decorate('mistake');
    }

    this.fire('update');
    return this;
};
BlankFiller.prototype.styleCorrect = function (blank, choice) {
    blank.empty();
    blank.append(new Visual(document.createElement('span')), {})
        .text(choice.token)
        .decorate('correct');
    this.__sentence.decorate('correct');
    this.decorate('correct');
    return this;
};
BlankFiller.prototype.styleMistake = function (blank, choice) {
    blank.decorate('mistake');
    this.__sentence.decorate('mistake');
    this.decorate('mistake');
    return this;
};
//TheBlankFiller.prototype.evaluate = function (blank, choice) {
//    if (!this.__unsolvedBlanks.contains(blank)) {
//        // Blank was already solved
//        return this;
//    }
//
//    if (blank.data('answers').contains(choice.token)) {
//        //  Solve blank
//        this.isHurt(true)
//            .isAttacking(false)
//            .attackPoints(1 / this.__blanks.length);
//        this.__unsolvedBlanks.remove(blank);
//        this.__solvedBlanks.push(blank);
//        if (this.__unsolvedBlanks.length === 0) {
//            this.isDead(true);
//        }
//    } else {
//        //  Mistake
//        this.isHurt(false)
//            .isAttacking(true)
//            .attackPoints(1 / this.__blanks.length)
//            .isDead(false);
//    }
//
//    return this;
//};
BlankFiller.prototype.setBlank = function (nextBlank) {
    if (nextBlank >= 0 && nextBlank < this.__blanks.length) {
        this.__blanks[this.blank]
            .strip('focused');
        this.blank = this.__blanks[nextBlank]
            .decorate('focused');
    }

    return this;
};
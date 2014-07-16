/**
 * User: guyman
 * Date: 6/24/14
 * Time: 8:33 PM
 */
function Exercise(elem) {
    Entity.call(this, elem);

    this.__questionsData__ = [];
    this.__questions__ = [];

    this.__title__ = null;
    this.__questionIdx__ = -1;
    this.__blankIdx__ = -1;
    this.__isQuestionReady__ = false;
    this.__readyForAnswer__ = false;

    this.scene = {
        question:          null,
        answers:       null,
        progressBarWrapper: null,
        titlewrapper:       null
    };

    this.load.bind(this);
    this.progress.bind(this);
}
Exercise.prototype = Object.create(Entity.prototype);
Exercise.prototype.load = function (spec) {
    var data = {
        id:        0,
        title:     '',
        subject:   '',
        questions: ''
    };

    extend(data, spec);

    this.__questionsData__ = data.questions;
    for (var i = 0; i < this.__questionsData__.length; i++) {
        var blanks, question = new Question('div')
            .load(this.__questionsData__[i])
            .on('set', this.setQuestion.bind(this));
        blanks = question.getBlanks();
        for (var j=0; j<blanks.length; j++) {
            var answers;
            blanks[j].on('click', this.selectBlank.bind(this));
            answers = blanks[j].getAnswers();
            for (var k=0; k<answers.length; k++) {
                answers[k].on('click', this.submitAnswer.bind(this));
            }
        }
        this.__questions__.push(question);
    }

    this.getNextQuestion().fire('set');

    //TODO set title
    return this;
};
Exercise.prototype.submitAnswer = function (answer) {
    log('submitAnswer', [answer]);

    if (answer.isSubmitted()) {
        return this;
    }


    var thisBlank = this.scene.question.getSelectedBlank();
    thisBlank.fill(answer);
//    answer.submit() //submit progresses question to next blank if one exists
//        .disable();
    if (!thisBlank.isSolved() && thisBlank.attemptsMade() < thisBlank.maxAttempts()) {
        return this;
    }

    var nextQuestion, nextBlank;
    nextBlank = this.getNextBlank();
    if (!nextBlank) {
        nextQuestion = this.getNextQuestion();
        if (!nextQuestion) {
            return this.end();
        }
        setTimeout(this.setQuestion.bind(this, nextQuestion), 1500);
        return this;
    }

    setTimeout(this.selectBlank.bind(this, nextBlank), 300);
    return this;
};
Exercise.prototype.getSelectedBlank = function() {
    return this.scene.question.getSelectedBlank();
};
Exercise.prototype.selectBlank = function(blank) {
    log('select blank', [blank]);
    this.scene.question.selectBlank(blank);
    this.setAnswers(blank.getAnswers());
    return this;
};
Exercise.prototype.selectQuestion = function(question) {

    var selectedQuestion = this.getSelectedQuestion();
    if (selectedQuestion) {
        this.scene.questions.remove(selectedQuestion);
    }

    var selectedBlank = question.getSelectedBlank(),
        nextUnsolvedBlank;

    if (!selectedBlank) {
        nextUnsolvedBlank = question.getNextUnsolvedBlank();
        if (!nextUnsolvedBlank) {
            return this;
        }
        selectedBlank = nextUnsolvedBlank;
    }

    this.selectBlank(selectedBlank);
};
Exercise.prototype.onBlankSolved = function(blank) {

};
Exercise.prototype.onBlankFailed = function(blank) {

};
Exercise.prototype.onBlankSelect = function(blank) {
    blank.getAnswers()
};
Exercise.prototype.onBlankDeselect = function(blank) {

};
Exercise.prototype.showAnswers = function(answers) {

};
Exercise.prototype.progress = function () {
    this.__isQuestionReady__ = false;
    this.__readyForAnswer__ = false;
    // move to next blank
    var nextQuestion = this.nextQuestion.bind(this);
    var nextBlank = this.nextBlank.bind(this);
    var end = this.end.bind(this);
    if (!this.nextBlank()) {
        // no more blanks in question - move to next question
        setTimeout(function () {
            if (!nextQuestion()) {
                // no more questions - exercise completed
                return end();
            }
            nextBlank();
        }, 2000);
    }
    return this;
};
Exercise.prototype.end = function () {

};
Exercise.prototype.onBlankSelect = function (blank) {
    var answers = blank.getAnswers();
    this.scene.answers.removeChildren(answers);
    for (var i = 0; i < answers.length; i++) {
        answers[i].appendTo(this.scene.answers);
    }
    return this;
};
Exercise.prototype.onBlankDeselect = function (blank) {
    var answers = blank.getAnswers();
    for (var i = 0; i < answers.length; i++) {
        answers[i].remove();
    }
    return this;
};
Exercise.prototype.nextQuestion = function () {
    // if no more questions left
    if (this.__questionIdx__ + 1 === this.__questions__.length) {
        return null;
    }

    this.__questionIdx__++;
    if (this.__questionIdx__ === this.__questions__.length) {
        return null;
    }

    this.scene.questions.empty();
    var nextQuestion = new Question('div')
        .load(this.__questions__[this.__questionIdx__]);

    var blanks = this.__questions__.getBlanks();
    for (var i = 0; i < blanks.length; i++) {
        blanks[i].on('select', this.onBlankSelect.bind(this), [blanks[i]]);
    }

    this.__isQuestionReady__ = true;
    return nextQuestion;
};
Exercise.prototype.getNextQuestion = function () {

    // if no more questions left
    this.__questionIdx__++;
    if (this.__questionIdx__ === this.__questions__.length) {
        return null;
    }

    return this.__questions__[this.__questionIdx__];
};
Exercise.prototype.selectUnsolvedBlank = function(question) {
    if (question.areAllBlanksSolved()) {
        log('all blanks solved');
        return this;
    }

    var unsolved = question.getBlanksUnsolved();
    this.selectBlank(unsolved[0]);
    return this;
};
/*
Selects the next unsolved question in exercise
 */
Exercise.prototype.selectUnsolvedQuestion = function() {
    for (var i=0; i<this.__questions__.length; i++) {
        if (!this.__questions__.areAllBlanksSolved()) {
            this.selectQuestion(this.__questions__[i]);
            break;
        }
    }
    return this;
};
/*
Sets the given questions on scene and invokes selectUnsolvedBlank with question
 */
Exercise.prototype.setQuestion = function(question) {
    log('setQuestion', question);
    Entity.getEntityById('question')
        .empty()
        .appendChild(question);

    this.scene.question = question;
    this.selectBlank(this.getNextBlank());
    return this;
};
Exercise.prototype.setAnswers = function(answers) {
    log('setAnswers', answers);
    var container = Entity.getEntityById('answers'),
        onclick = this.submitAnswer.bind(this);
//    container.getChildren().forEach(function (child) {
//        child.off('click', onclick)
//            .remove();
//    });

    container.empty();
    answers.forEach(function(answer) {
        log('forEach ', [answer]);
        answer.appendTo(container);
    });

    this.scene.answers = answers;
    return this;
};
Exercise.prototype.nextBlank = function (question) {
    var nextBlank;

    if (this.__blankIdx__ + 1 >= question.getBlanks().length) {
        return null;
    }
    var blanks = question.getBlanks();
    var selectedBlank = blanks[this.__blankIdx__];

    this.__blankIdx__++;
    if (this.__blankIdx__ === blanks.length) {
        return null;
    }

    selectedBlank.deselect();

    nextBlank = blanks[this.__blankIdx__];
    nextBlank.select();

    return this;
};
Exercise.prototype.getSelectedQuestion = function() {
    return this.__questions__[this.__questionIdx__];
};
Exercise.prototype.getNextBlank = function () {
    var blanks = this.scene.question.getBlanks();
    for (var i=0; i<blanks.length; i++) {
        if (!blanks[i].isSolved() && blanks[i].attemptsLeft() > 0) {
            return blanks[i];
        }
    }

    return null;
};
Exercise.prototype.isQuestionSolved = function(question) {

};
Exercise.prototype.getUnsolvedQuestions = function () {
    var unsolved = [];
    for (var i = 0; i < this.__questions__.length; i++) {
        if (!this.__questions__[i].isSolved()) {
            unsolved.push(this.__questions__[i]);
        }
    }
    return unsolved;
};
/**
 * User: guyman
 * Date: 6/21/14
 * Time: 3:52 PM
 */
function Question(elem) {
    Entity.call(this, elem);
    this.__blanks__ = [];
    this.__selectedBlank__ = null;
    this.__blankIdx__ = -1;
    this.__isComplete__ = false;
}
Question.prototype = Object.create(Entity.prototype);
Question.prototype.constructor = Question;
Question.prototype.onBlankSolved = function () {
    //TODO animate based on the state of the blank
    // update state of question based on state of blank
    log('Question.prototype.onBlankSolved');
};
Question.prototype.onBlankFailed = function () {
    //TODO animate based on the state of the blank
    // update state of question based on state of blank
    log('Question.prototype.onBlankFailed');
};
Question.prototype.onBlankSelect = function () {
    //TODO animate
    log('Question.prototype.onBlankSelect');
};
Question.prototype.onBlankDeselect = function () {
    //TODO animate
    log('Question.prototype.onBlankDeselect');
};
Question.prototype.isComplete = function () {
    return this.__isComplete__;
};
Question.prototype.load = function (spec) {
    var data = {
            html: '',
            blanks: []
        },
        blanks = [];

    data = extend(data, spec);

    this.setHtml(data.html).setClassName('question');
    blanks = this.getEntitiesByClassName('blank');
    for (var i = 0; i < blanks.length; i++) {
        var newBlank = new Blank('span')
            .load(data.blanks[i])
            .on('solved', this.onBlankSolved)
            .on('failed', this.onBlankFailed)
            .on('select', this.onBlankSelect)
            .on('deselect', this.onBlankDeselect);
        this.appendChild(newBlank).replaceChild(newBlank, blanks[i]);
        this.__blanks__.push(newBlank);
    }
    log(this);

    return this;
};
Question.prototype.getBlanks = function () {
    return this.__blanks__;
};
Question.prototype.getSelectedBlank = function () {
    return this.__selectedBlank__;
};
Question.prototype.getBlanksSolved = function () {
    var solved = [];
    for (var i = 0; i < this.__blanks__.length; i++) {
        if (this.__blanks__[i].isSolved()) {
            solved.push(this.__blanks__[i]);
        }
    }
    return solved;
};
Question.prototype.getBlanksUnsolved = function () {
    var unsolved = [];
    for (var i = 0; i < this.__blanks__.length; i++) {
        if (!this.__blanks__[i].isSolved()) {
            unsolved.push(this.__blanks__[i]);
        }
    }
    return unsolved;
};
Question.prototype.selectBlank = function(blank) {
    for (var i=0; i<this.__blanks__.length; i++) {
        if (this.__blanks__[i].isSelected()) {
            this.__blanks__[i].deselect();
        }
    }
    this.__selectedBlank__ = blank.select();
    return this;
};
Question.prototype.nextBlank = function() {
    // if there is a current blank
    if (this.__blankIdx__ >= 0) {
        this.__blanks__[this.__blankIdx__].deselect();
    }

    // if no more blanks left
    if (this.__blankIdx__ + 1 === this.__blanks__.length) {
        return null;
    }

    this.__blankIdx__++;

    return this.__blanks__[this.__blankIdx__].select();
};
Question.prototype.countBlanksSolved = function () {
    return this.getBlanksSolved().length;
};
Question.prototype.countBlanksUnsolvedSolved = function () {
    return this.getBlanksUnsolved().length;
};
Question.prototype.getNextUnsolvedBlank = function () {
    for (var i = 0; i < this.__blanks__.length; i++) {
        if (this.__blanks__[i].isSolved()) {
            return this.__blanks__[i];
        }
    }
    return null;
};

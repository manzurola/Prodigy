/**
 * User: guyman
 * Date: 6/22/14
 * Time: 2:03 AM
 */
function Blank(elem) {
    Entity.call(this, elem);
    this.__answers__ = [];
    this.__inside__ = null;
    this.__star__ = null;
    this.__isSolved__ = false;
    this.__isSelected__ = false;
    this.__attemptsMade__ = 0;
    this.__maxAttempts__ = 4;
}
Blank.prototype = Object.create(Entity.prototype);
Blank.prototype.constructor = Blank;
Blank.prototype.isSolved = function () {
    return this.__isSolved__;
};
Blank.prototype.load = function (spec) {
    var data = {
        answers:     null,
        maxAttempts: 4
    };
    extend(data, spec);
    for (var i = 0; i < data.answers.length; i++) {
        var answer = new Answer('span')
            .load(data.answers[i]);
        this.__answers__.push(answer);
    }
    this.__maxAttempts__ = data.maxAttempts;
    this.setClassName('blank');
    this.__star__ = new Entity('span').setClassName('answer')
        .appendChild(new Entity('span').setClassName('icon-star'));
    this.appendChild(this.__star__);
    return this;
};
Blank.prototype.select = function () {
    this.__isSelected__ = true;
    this.addClasses('select')
        .fire('select');
    return this;
};
Blank.prototype.deselect = function () {
    this.__isSelected__ = false;
    this.removeClasses('select')
        .fire('deselect');
    return this;
};
Blank.prototype.fill = function (answer) {

    var copyOfAnswer = answer.clone(true),
        origToken = answer.getToken;

    this.__attemptsMade__ += 1;
    if (answer.isCorrect()) {
        if (this.__inside__) {
            this.__inside__.remove();
        }

        this.__isSolved__ = true;
        this.__star__.remove();
        // If correct on first attempt
        if (this.__attemptsMade__ === 1) {
//            answer.setFeedbackToken('GREAT!');
//            answer.on('webkitAnimationEnd', function (target) {
//                target.setText(origToken);
//            })
        }
        this.appendChild(copyOfAnswer.submit());
        this.__inside__ = copyOfAnswer;
    }

    log('attemptsMade: ' + this.__attemptsMade__);

    this.fire('fill');

    return this;
};
Blank.prototype.getAnswers = function () {
    return this.__answers__;
};
Blank.prototype.getAnswersSubmitted = function () {
    var submitted = [];
    for (var i = 0; i < this.__answers__.length; i++) {
        if (this.__answers__[i].isSubmitted()) {

        }
        submitted.push(this.__answers__[i]);
    }
    return submitted;
};
Blank.prototype.countAnswersSubmitted = function () {
    return this.getAnswersSubmitted().length;
};
Blank.prototype.isSelected = function () {
    return this.__isSelected__;
};
Blank.prototype.attemptsMade = function () {
    return this.__attemptsMade__;
};
Blank.prototype.attemptsLeft = function () {
    return this.__maxAttempts__ - this.__attemptsMade__;
};
Blank.prototype.maxAttempts = function () {
    return this.__maxAttempts__;
};
Blank.prototype.showAnswers = function () {
    for (var i = 0; this.__answers__.length; i++) {
        this.__answers__[i].show();
    }
    return this;
};
Blank.prototype.hideAnswers = function () {
    for (var i = 0; this.__answers__.length; i++) {
        this.__answers__[i].hide();
    }
    return this;
};

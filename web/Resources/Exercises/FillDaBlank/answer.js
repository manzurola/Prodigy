/**
 * User: guyman
 * Date: 6/21/14
 * Time: 2:32 AM
 */
function Answer(elem) {
    Entity.call(this, elem);
    this.__isCorrect__ = false;
    this.__token__ = '';
    this.__feedbackToken__ = '';
    this.__isSubmitted__ = false;
}
Answer.prototype = Object.create(Entity.prototype);
Answer.prototype.constructor = Answer;
Answer.prototype.load = function(spec) {
    var data = {
        correct: false,
        blankIndex: 0,
        token: ''
    };
    extend(data, spec);
    this.__isCorrect__ = data.correct;
    this.__token__ = new Entity('span')
        .setClassName('token')
        .setText(data.token);
    this.__feedbackToken__ = new Entity('span')
        .setClassName('feedback-token')
        .setText('GREAT!');
    this.setClassName('answer')
        .appendChild(this.__token__)
        .appendChild(this.__feedbackToken__);

    return this;
};
Answer.prototype.submit = function () {
    this.__isSubmitted__ = true;
    if (this.__isCorrect__) {
        this.addClasses('correct');
    } else {
        this.addClasses('wrong');
    }
    this.on('animationEnd', function(target) {
        log('animation end', target);
        target.removeClasses('correct')
            .removeClasses('wrong');
    }, this);
    this.fire('submit');
    return this;
};
Answer.prototype.show = function () {
    //TODO
    return this;
};
Answer.prototype.hide = function () {
    //TODO
    return this;
};
Answer.prototype.getToken = function() {
    return this.__token__.getText();
};
Answer.prototype.setToken = function(token) {
    this.__token__.setText(token);
    return this;
};
Answer.prototype.getFeedbackToken = function() {
    return this.__feedbackToken__.getText();
};
Answer.prototype.setFeedbackToken = function(token) {
    this.__feedbackToken__.setText(token);
    return this;
};
Answer.prototype.isCorrect = function() {
    return this.__isCorrect__;
};
Answer.prototype.isSubmitted = function() {
    return this.__isSubmitted__;
};

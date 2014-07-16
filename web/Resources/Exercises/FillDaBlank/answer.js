/**
 * User: guyman
 * Date: 6/21/14
 * Time: 2:32 AM
 */
function Answer(elem) {
    Entity.call(this, elem);
    this.__isCorrect__ = false;
    this.__token__ = new Entity('span');
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
    this.__feedbackToken__ = new Entity('span')
        .setClassName('feedback-token')
        .setText('GREAT!');
    this.setClassName('answer')
        .appendChild(this.__token__)
        .setToken(data.token);
//        .appendChild(this.__feedba
// ckToken__);

    return this;
};
Answer.prototype.submit = function () {
    this.__isSubmitted__ = true;
    if (this.__isCorrect__) {
        this.addClasses('correct');
    } else {
        this.addClasses('wrong');
    }
//    this.__token__.hide();
//    this.__feedbackToken__.show();

    this.on('animationEnd', function(target) {
        log('animation end', target);
//        target.__feedbackToken__.hide();
//        this.__token__.show();
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

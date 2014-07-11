/**
 * User: guyman
 * Date: 6/21/14
 * Time: 2:32 AM
 */
function Answer(elem) {
    Entity.call(this, elem);
    this.__isCorrect__ = false;
    this.__token__ = '';
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
    this.__token__ = data.token;
    this.setClassName('answer')
        .setToken(this.__token__);
    return this;
};
Answer.prototype.submit = function () {
    this.__isSubmitted__ = true;
    if (this.__isCorrect__) {
        this.addClasses('correct');
    } else {
        this.addClasses('wrong');
    }
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
    return this.__token__;
};
Answer.prototype.setToken = function(token) {
    this.__token__ = token;
    return this.setText(this.__token__);
};
Answer.prototype.isCorrect = function() {
    return this.__isCorrect__;
};
Answer.prototype.isSubmitted = function() {
    return this.__isSubmitted__;
};

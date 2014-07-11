/**
 * User: guyman
 * Date: 6/8/14
 * Time: 11:01 PM
 */
function Question(view, spec) {

    this.isSolved = false;
    this.atBlank = 0;
    this.blanks = [];
    this.answers = [];
}

Question.prototype = Object.create(Entity.prototype);

Question.prototype.constructor = Question;

Question.prototype.submit = function(answer) {
    var thisBlank = this.blanks[this.atBlank];
    if (answer.isCorrect) {
        answer.addClass("correct");
        thisBlank.appendChild(answer);
        return true;
    }

    return false;
};

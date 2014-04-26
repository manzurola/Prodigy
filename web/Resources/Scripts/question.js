/**
 * User: guyman
 * Date: 1/10/14
 * Time: 3:26 AM
 */

function Answer() {
    this.confidence = 0;
    this.speed = 0;
    this.points = 0;
    this.penalty = 0;
}

function QuestionData() {

}
QuestionData.prototype.parse = function (object) {
};

/**
 * A question changes state after an answer is submitted.
 * Submitting the same answer does not affect state.
 *
 * @param elem
 * @param spec
 * @constructor
 */
function Question(elem, spec) {
    Visual.call(this, elem, spec);
    this.id;
    this.difficulty;
    this.answer = null;
}
Question.prototype = Object.create(Visual.prototype);
Question.prototype.constructor = Question;
Question.prototype.init = function (game) {
};


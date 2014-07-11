/**
 * User: guyman
 * Date: 1/12/14
 * Time: 12:30 AM
 */

function RewriterQuestion(elem, spec) {
    this.origSentence = spec.origSentence;
    this.newSentence = spec.newSentence;
    this.words = spec.words;
}
RewriterQuestion.prototype.onWordClick = function (word) {
    // Check if target sentence contains word at current index
};

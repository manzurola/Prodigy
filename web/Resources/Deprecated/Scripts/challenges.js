/**
 * User: guyman
 * Date: 12/13/13
 * Time: 1:19 AM
 */

/**
 *
 * @param elem
 * @param spec  sentence:  the complete sentence. Missing words are marked as '<span class="blank"></span> where
 *              the inner text specifies one or more missing words delimited by ','. For example:
 *
 *              dummies:    an array of additional choices to present. For example:
 *                                          [John, Guy, Robert]
 * @constructor
 */
function GapFillerChallenge(spec) {
    var that = Challenge(spec).decorate('gapfiller'),
        sentence = {},
        blanks = [],
        choices = [],
        focusedBlank = 0,
        solvedBlanks = 0;

    (function init(_sentence, _dummies) {
        var rawBlanks = __paragraph__.getElementsByClassName('blank');
        for (var i = 0; i < rawBlanks.length; i++) {
            var blankElem = rawBlanks[i];  //  contains the span block with answers inside it
            var solutions = blankElem.innerText.split(','); //  array of correct answers
            blankElem.innerText = '';   //  clear answers from initial state
            blanks.push(createBlank(solutions));
            for (var j = 0; j < solutions.length; j++) {
                choices.push(createChoice(solutions[i]));

            }
        }
        for (var k = 0; k < _dummies.length; k++) {
            choices.push(createChoice(_dummies[i]));
        }
        sentence = createSentence(_sentence);
        that.append(_sentence);
        return that;
    }());

    function createChoice(_token) {
        return Visual({
            element: document.createElement('div')
        }).text(_token)
            .decorate('button choice')
            .on('click', submit);
    }

    function createBlank(_element, _solutions) {
        return Visual({
            element: _element
        }).data({
                answers: _solutions,
                attempts:  0,
                solved:    false,
                focused:   false
            }).decorate('empty');
    }

    function createSentence(_html) {
        return Visual({
            element: document.createElement('div')
        }).html(_html)
            .decorate('sentence');
    }

    /**
     * Submits the supplied choice as an answer to the focused blank.
     * If blank is solved, do nothing
     * If attempts per blank reached limit, and answer is mistake, put answer
     * in blank, publish answer and move to next one.
     * If correct, put answer in blank, publish answer and move to next one.
     *
     * @param choice
     */
    function submit(choice) {
        var blank = blanks[focusedBlank];
        var solutionIndex = blank.data().answers.indexOf(choice.spec.token);
        if (solutionIndex < 0) {
            //  Mistake
            if (blank.data().attemps > that.maxAnswerAttempts) {
                //  Put answer in blank
            }
            that.decorate('mistake');
            blank.decorate('mistake');
            choice.decorate('mistake');
        } else {
            //  Correct
            that.text(choice.text());
            that.decorate('correct');
            blank.decorate('correct');
            choice.decorate('correct');
        }
        that.notifySubmit(answer{
            attempts: blank.data('attempts'),
            correct:
        }))
    }

    return that;
}


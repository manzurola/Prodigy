package model;

import java.util.Collection;

/**
 * User: guy
 * Date: 3/8/13
 * Time: 4:48 PM
 */
public class Blank {
    private Integer index;
    private Integer questionId;
    private Collection<Answer> answers;
    private Question questionsByQuestionId;

    public Integer getIndex() {
        return index;
    }

    public void setIndex( Integer index ) {
        this.index = index;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId( Integer questionId ) {
        this.questionId = questionId;
    }

    public Collection<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers( Collection<Answer> answers ) {
        this.answers = answers;
    }

    public Question getQuestionsByQuestionId() {
        return questionsByQuestionId;
    }

    public void setQuestionsByQuestionId( Question questionsByQuestionId ) {
        this.questionsByQuestionId = questionsByQuestionId;
    }

    @Override
    public boolean equals( Object o ) {
        if( this == o ) return true;
        if( o == null || getClass() != o.getClass() ) return false;

        Blank blank = ( Blank ) o;

        if( index != null ? !index.equals( blank.index ) : blank.index != null ) return false;
        if( questionId != null ? !questionId.equals( blank.questionId ) : blank.questionId != null ) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = index != null ? index.hashCode() : 0;
        result = 31 * result + ( questionId != null ? questionId.hashCode() : 0 );
        return result;
    }
}

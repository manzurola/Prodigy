package com.manzurola.prodigy.model;

/**
 * User: guy
 * Date: 3/8/13
 * Time: 4:48 PM
 */
public class Answer {

    private Integer questionId;
    private Integer index;
    private String token;
    private Boolean correct;
    private String feedback;
    private Blank blanks;


    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId( Integer questionId ) {
        this.questionId = questionId;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex( Integer index ) {
        this.index = index;
    }

    public String getToken() {
        return token;
    }

    public void setToken( String token ) {
        this.token = token;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect( Boolean correct ) {
        this.correct = correct;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback( String feedback ) {
        this.feedback = feedback;
    }

    public Blank getBlanks() {
        return blanks;
    }

    public void setBlanks( Blank blanks ) {
        this.blanks = blanks;
    }

    @Override
    public boolean equals( Object o ) {
        if( this == o ) return true;
        if( o == null || getClass() != o.getClass() ) return false;

        Answer answer = ( Answer ) o;

        if( correct != null ? !correct.equals( answer.correct ) : answer.correct != null ) return false;
        if( feedback != null ? !feedback.equals( answer.feedback ) : answer.feedback != null ) return false;
        if( index != null ? !index.equals( answer.index ) : answer.index != null ) return false;
        if( questionId != null ? !questionId.equals( answer.questionId ) : answer.questionId != null ) return false;
        if( token != null ? !token.equals( answer.token ) : answer.token != null ) return false;

        return true;
    }

    @Override
    public int hashCode() {

        int result = 31 *  ( questionId != null ? questionId.hashCode() : 0 );
        result = 31 * result + ( index != null ? index.hashCode() : 0 );
        result = 31 * result + ( token != null ? token.hashCode() : 0 );
        result = 31 * result + ( correct != null ? correct.hashCode() : 0 );
        result = 31 * result + ( feedback != null ? feedback.hashCode() : 0 );
        return result;
    }
}

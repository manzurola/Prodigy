package model;

import java.io.Serializable;

/**
 * User: guy
 * Date: 3/8/13
 * Time: 4:48 PM
 */
public class AnswerPK implements Serializable {
    private Integer questionId;

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId( Integer questionId ) {
        this.questionId = questionId;
    }

    private Integer index;

    public Integer getIndex() {
        return index;
    }

    public void setIndex( Integer index ) {
        this.index = index;
    }

    private String token;

    public String getToken() {
        return token;
    }

    public void setToken( String token ) {
        this.token = token;
    }

    @Override
    public boolean equals( Object o ) {
        if( this == o ) return true;
        if( o == null || getClass() != o.getClass() ) return false;

        AnswerPK answerPK = ( AnswerPK ) o;

        if( index != null ? !index.equals( answerPK.index ) : answerPK.index != null ) return false;
        if( questionId != null ? !questionId.equals( answerPK.questionId ) : answerPK.questionId != null ) return false;
        if( token != null ? !token.equals( answerPK.token ) : answerPK.token != null ) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = questionId != null ? questionId.hashCode() : 0;
        result = 31 * result + ( index != null ? index.hashCode() : 0 );
        result = 31 * result + ( token != null ? token.hashCode() : 0 );
        return result;
    }
}

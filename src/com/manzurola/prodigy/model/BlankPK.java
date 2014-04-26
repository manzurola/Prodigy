package com.manzurola.prodigy.model;

import java.io.Serializable;

/**
 * User: guy
 * Date: 3/8/13
 * Time: 4:48 PM
 */
public class BlankPK implements Serializable {
    private Integer index;
    private Integer questionId;

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

    @Override
    public boolean equals( Object o ) {
        if( this == o ) return true;
        if( o == null || getClass() != o.getClass() ) return false;

        BlankPK blankPK = ( BlankPK ) o;

        if( index != null ? !index.equals( blankPK.index ) : blankPK.index != null ) return false;
        if( questionId != null ? !questionId.equals( blankPK.questionId ) : blankPK.questionId != null ) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = index != null ? index.hashCode() : 0;
        result = 31 * result + ( questionId != null ? questionId.hashCode() : 0 );
        return result;
    }
}

package com.manzurola.prodigy.domain;

import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: guyman
 * Date: 11/22/13
 * Time: 6:48 PM
 * To change this template use File | Settings | File Templates.
 */
public class BlankPK implements Serializable {
    private int questionId;

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    private int idx;

    public int getIdx() {
        return idx;
    }

    public void setIdx(int idx) {
        this.idx = idx;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        BlankPK blankPK = (BlankPK) o;

        if (idx != blankPK.idx) return false;
        if (questionId != blankPK.questionId) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = questionId;
        result = 31 * result + idx;
        return result;
    }
}

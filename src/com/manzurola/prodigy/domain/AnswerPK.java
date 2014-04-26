package com.manzurola.prodigy.domain;

import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: guyman
 * Date: 11/22/13
 * Time: 6:48 PM
 * To change this template use File | Settings | File Templates.
 */
public class AnswerPK implements Serializable {
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    private int blankId;

    public int getBlankId() {
        return blankId;
    }

    public void setBlankId(int blankId) {
        this.blankId = blankId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AnswerPK answerPK = (AnswerPK) o;

        if (blankId != answerPK.blankId) return false;
        if (token != null ? !token.equals(answerPK.token) : answerPK.token != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = token != null ? token.hashCode() : 0;
        result = 31 * result + blankId;
        return result;
    }
}

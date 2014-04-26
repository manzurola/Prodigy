package com.manzurola.prodigy.domain;

/**
 * Created with IntelliJ IDEA.
 * User: guyman
 * Date: 11/22/13
 * Time: 6:48 PM
 * To change this template use File | Settings | File Templates.
 */
public class Answer {
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    private boolean correct;

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    private String feedback;

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    private int blankId;

    public int getBlankId() {
        return blankId;
    }

    public void setBlankId(int blankId) {
        this.blankId = blankId;
    }

    private int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Answer answer = (Answer) o;

        if (blankId != answer.blankId) return false;
        if (correct != answer.correct) return false;
        if (id != answer.id) return false;
        if (feedback != null ? !feedback.equals(answer.feedback) : answer.feedback != null) return false;
        if (token != null ? !token.equals(answer.token) : answer.token != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = token != null ? token.hashCode() : 0;
        result = 31 * result + (correct ? 1 : 0);
        result = 31 * result + (feedback != null ? feedback.hashCode() : 0);
        result = 31 * result + blankId;
        result = 31 * result + id;
        return result;
    }
}

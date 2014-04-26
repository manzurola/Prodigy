package com.manzurola.prodigy.domain;

/**
 * Created with IntelliJ IDEA.
 * User: guyman
 * Date: 11/22/13
 * Time: 6:48 PM
 * To change this template use File | Settings | File Templates.
 */
public class Blank {
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

        Blank blank = (Blank) o;

        if (id != blank.id) return false;
        if (idx != blank.idx) return false;
        if (questionId != blank.questionId) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = questionId;
        result = 31 * result + idx;
        result = 31 * result + id;
        return result;
    }

    private Answer answersById;

    public Answer getAnswersById() {
        return answersById;
    }

    public void setAnswersById(Answer answersById) {
        this.answersById = answersById;
    }

    private Question questionsByQuestionId;

    public Question getQuestionsByQuestionId() {
        return questionsByQuestionId;
    }

    public void setQuestionsByQuestionId(Question questionsByQuestionId) {
        this.questionsByQuestionId = questionsByQuestionId;
    }
}

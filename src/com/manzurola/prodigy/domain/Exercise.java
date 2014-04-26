package com.manzurola.prodigy.domain;

import java.util.Collection;

/**
 * Created with IntelliJ IDEA.
 * User: guyman
 * Date: 11/22/13
 * Time: 6:48 PM
 * To change this template use File | Settings | File Templates.
 */
public class Exercise {
    private int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    private String title;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    private int questionCount;

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
    }

    private int subjectId;

    public int getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Exercise exercise = (Exercise) o;

        if (id != exercise.id) return false;
        if (questionCount != exercise.questionCount) return false;
        if (subjectId != exercise.subjectId) return false;
        if (title != null ? !title.equals(exercise.title) : exercise.title != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + questionCount;
        result = 31 * result + subjectId;
        return result;
    }

    private Subject subjectsBySubjectId;

    public Subject getSubjectsBySubjectId() {
        return subjectsBySubjectId;
    }

    public void setSubjectsBySubjectId(Subject subjectsBySubjectId) {
        this.subjectsBySubjectId = subjectsBySubjectId;
    }

    private Collection<Question> questionsesById;

    public Collection<Question> getQuestionsesById() {
        return questionsesById;
    }

    public void setQuestionsesById(Collection<Question> questionsesById) {
        this.questionsesById = questionsesById;
    }
}

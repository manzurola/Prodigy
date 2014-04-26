package com.manzurola.prodigy.domain;

import java.util.Collection;

/**
 * Created with IntelliJ IDEA.
 * User: guyman
 * Date: 11/22/13
 * Time: 6:48 PM
 * To change this template use File | Settings | File Templates.
 */
public class Question {
    private int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    private String html;

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    private int exerciseId;

    public int getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(int exerciseId) {
        this.exerciseId = exerciseId;
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

        Question question = (Question) o;

        if (exerciseId != question.exerciseId) return false;
        if (id != question.id) return false;
        if (idx != question.idx) return false;
        if (html != null ? !html.equals(question.html) : question.html != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (html != null ? html.hashCode() : 0);
        result = 31 * result + exerciseId;
        result = 31 * result + idx;
        return result;
    }

    private Collection<Blank> blanksesById;

    public Collection<Blank> getBlanksesById() {
        return blanksesById;
    }

    public void setBlanksesById(Collection<Blank> blanksesById) {
        this.blanksesById = blanksesById;
    }

    private Exercise exercisesByExerciseId;

    public Exercise getExercisesByExerciseId() {
        return exercisesByExerciseId;
    }

    public void setExercisesByExerciseId(Exercise exercisesByExerciseId) {
        this.exercisesByExerciseId = exercisesByExerciseId;
    }
}

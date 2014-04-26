package com.manzurola.prodigy.domain;

import java.util.Collection;

/**
 * Created with IntelliJ IDEA.
 * User: guyman
 * Date: 11/22/13
 * Time: 6:48 PM
 * To change this template use File | Settings | File Templates.
 */
public class Subject {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private int exerciseCount;

    public int getExerciseCount() {
        return exerciseCount;
    }

    public void setExerciseCount(int exerciseCount) {
        this.exerciseCount = exerciseCount;
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

        Subject subject = (Subject) o;

        if (exerciseCount != subject.exerciseCount) return false;
        if (id != subject.id) return false;
        if (name != null ? !name.equals(subject.name) : subject.name != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + exerciseCount;
        result = 31 * result + id;
        return result;
    }

    private Collection<Exercise> exercisesesById;

    public Collection<Exercise> getExercisesesById() {
        return exercisesesById;
    }

    public void setExercisesesById(Collection<Exercise> exercisesesById) {
        this.exercisesesById = exercisesesById;
    }
}

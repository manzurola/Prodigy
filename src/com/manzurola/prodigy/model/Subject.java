package com.manzurola.prodigy.model;

import java.util.Collection;

/**
 * User: guy
 * Date: 3/8/13
 * Time: 4:48 PM
 */
public class Subject {
    private String name;
    private Integer numberOfExercises;
    private Collection<Exercise> exercisesByName;

    public String getName() {
        return name;
    }

    public void setName( String name ) {
        this.name = name;
    }

    public Integer getNumberOfExercises() {
        return numberOfExercises;
    }

    public void setNumberOfExercises( Integer numberOfExercises ) {
        this.numberOfExercises = numberOfExercises;
    }

    public Collection<Exercise> getExercisesByName() {
        return exercisesByName;
    }

    public void setExercisesByName( Collection<Exercise> exercisesByName ) {
        this.exercisesByName = exercisesByName;
    }

    @Override
    public boolean equals( Object o ) {
        if( this == o ) return true;
        if( o == null || getClass() != o.getClass() ) return false;

        Subject subject = ( Subject ) o;

        if( name != null ? !name.equals( subject.name ) : subject.name != null ) return false;
        if( numberOfExercises != null ? !numberOfExercises.equals( subject.numberOfExercises ) : subject.numberOfExercises != null )
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + ( numberOfExercises != null ? numberOfExercises.hashCode() : 0 );
        return result;
    }
}

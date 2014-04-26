package model;

import java.util.Collection;

/**
 * User: guy
 * Date: 3/8/13
 * Time: 4:48 PM
 */
public class DifficultyLevel {
    private Integer level;
    private String name;
    private Collection<Exercise> exercisesByName;

    public Integer getLevel() {
        return level;
    }

    public void setLevel( Integer level ) {
        this.level = level;
    }

    public String getName() {
        return name;
    }

    public void setName( String name ) {
        this.name = name;
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

        DifficultyLevel that = ( DifficultyLevel ) o;

        if( level != null ? !level.equals( that.level ) : that.level != null ) return false;
        if( name != null ? !name.equals( that.name ) : that.name != null ) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = level != null ? level.hashCode() : 0;
        result = 31 * result + ( name != null ? name.hashCode() : 0 );
        return result;
    }
}

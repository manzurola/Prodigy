package model;

import java.util.*;

/**
 * User: guy
 * Date: 3/8/13
 * Time: 4:48 PM
 */
public class Question {
    private Integer id;
    private String html;
    private Integer exerciseId;
    private Integer index;
    private Collection<Blank> blanksById;
    private Exercise exerciseByExerciseId;

    public Integer getId() {
        return id;
    }

    public void setId( Integer id ) {
        this.id = id;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml( String html ) {
        this.html = html;
    }

    public Integer getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId( Integer exerciseId ) {
        this.exerciseId = exerciseId;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex( Integer index ) {
        this.index = index;
    }


    public Collection<Blank> getBlanksById() {
        return blanksById;
    }

    /**
     *
     * @return a collection of blanks sorted by idx field of blank
     */
    public List<Blank> getBlanksSortByIdx(){
        List<Blank> sorted = new ArrayList<Blank>( blanksById );
        Collections.sort( sorted, new Comparator<Blank>() {
            @Override
            public int compare( Blank o1, Blank o2 ) {
                if( o1.getIndex() < o2.getIndex() ) {
                    return -1;
                } else if( o1.getIndex() == o2.getIndex() ) {
                    return 0;
                }
                return 1;
            }
        } );
        return sorted;
    }

    public void setBlanksById( Collection<Blank> blanksById ) {
        this.blanksById = blanksById;
    }

    public Exercise getExerciseByExerciseId() {
        return exerciseByExerciseId;
    }

    public void setExerciseByExerciseId( Exercise exerciseByExerciseId ) {
        this.exerciseByExerciseId = exerciseByExerciseId;
    }

    @Override
    public boolean equals( Object o ) {
        if( this == o ) return true;
        if( o == null || getClass() != o.getClass() ) return false;

        Question question = ( Question ) o;

        if( exerciseId != null ? !exerciseId.equals( question.exerciseId ) : question.exerciseId != null ) return false;
        if( html != null ? !html.equals( question.html ) : question.html != null ) return false;
        if( id != null ? !id.equals( question.id ) : question.id != null ) return false;
        if( index != null ? !index.equals( question.index ) : question.index != null ) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + ( html != null ? html.hashCode() : 0 );
        result = 31 * result + ( exerciseId != null ? exerciseId.hashCode() : 0 );
        result = 31 * result + ( index != null ? index.hashCode() : 0 );
        return result;
    }
}

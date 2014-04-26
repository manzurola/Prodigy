package model;

import java.util.*;

/**
 * User: guy
 * Date: 3/8/13
 * Time: 4:48 PM
 */
public class Exercise {
    private Integer id;
    private String subjectName;
    private String title;
    private String difficultyLevelName;
    private Integer numberOfQuestions;
    private Subject subjectBySubjectName;
    private Collection<Question> questionsById;
    private DifficultyLevel difficultyLevelsByDifficultyLevelName;
    private Collection<Score> topScores;

    public Integer getId() {
        return id;
    }

    public void setId( Integer id ) {
        this.id = id;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName( String subjectName ) {
        this.subjectName = subjectName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle( String title ) {
        this.title = title;
    }

    public String getDifficultyLevelName() {
        return difficultyLevelName;
    }

    public void setDifficultyLevelName( String difficultyLevelName ) {
        this.difficultyLevelName = difficultyLevelName;
    }

    public Integer getNumberOfQuestions() {
        return numberOfQuestions;
    }

    public void setNumberOfQuestions( Integer numberOfQuestions ) {
        this.numberOfQuestions = numberOfQuestions;
    }

    public Subject getSubjectBySubjectName() {
        return subjectBySubjectName;
    }

    public void setSubjectBySubjectName( Subject subjectBySubjectName ) {
        this.subjectBySubjectName = subjectBySubjectName;
    }

    public DifficultyLevel getDifficultyLevelsByDifficultyLevelName() {
        return difficultyLevelsByDifficultyLevelName;
    }

    public void setDifficultyLevelsByDifficultyLevelName( DifficultyLevel difficultyLevelsByDifficultyLevelName ) {
        this.difficultyLevelsByDifficultyLevelName = difficultyLevelsByDifficultyLevelName;
    }

    public Collection<Score> getTopScores() {
        return topScores;
    }

    public void setTopScores( Collection<Score> topScores ) {
        this.topScores = topScores;
    }

    public Collection<Question> getQuestionsById() {
        return questionsById;
    }

    /**
     *
     * @return a list of questions sorted by idx field in question
     */
    public List<Question> getQuestionsSortByIdx(){
        List<Question> sorted = new ArrayList<Question>( questionsById );
        Collections.sort( sorted, new Comparator<Question>() {
            @Override
            public int compare( Question o1, Question o2 ) {
                if( o1.getIndex() < o2.getIndex() ) {
                    return -1;
                } else if( o1.getIndex() == o2.getIndex() ) {
                    return 0;
                } return 1;
            }
        } );
        return sorted;
    }


    public void setQuestionsById( Collection<Question> questionsById ) {
        this.questionsById = questionsById;
    }

    @Override
    public boolean equals( Object o ) {
        if( this == o ) return true;
        if( o == null || getClass() != o.getClass() ) return false;

        Exercise exercise = ( Exercise ) o;

        if( difficultyLevelName != null ? !difficultyLevelName.equals( exercise.difficultyLevelName ) : exercise.difficultyLevelName != null )
            return false;
        if( id != null ? !id.equals( exercise.id ) : exercise.id != null ) return false;
        if( numberOfQuestions != null ? !numberOfQuestions.equals( exercise.numberOfQuestions ) : exercise.numberOfQuestions != null )
            return false;
        if( subjectName != null ? !subjectName.equals( exercise.subjectName ) : exercise.subjectName != null )
            return false;
        if( title != null ? !title.equals( exercise.title ) : exercise.title != null ) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + ( subjectName != null ? subjectName.hashCode() : 0 );
        result = 31 * result + ( title != null ? title.hashCode() : 0 );
        result = 31 * result + ( difficultyLevelName != null ? difficultyLevelName.hashCode() : 0 );
        result = 31 * result + ( numberOfQuestions != null ? numberOfQuestions.hashCode() : 0 );
        return result;
    }
}

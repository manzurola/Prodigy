package model;

/**
 * User: guy
 * Date: 4/7/13
 * Time: 1:27 PM
 */
public class Score {
    private Integer id;
    private Integer exerciseId;
    private String playerName;
    private Integer score;
    private Exercise exerciseByExerciseId;

    public Integer getId() {
        return id;
    }

    public void setId( Integer id ) {
        this.id = id;
    }

    public Integer getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId( Integer exerciseId ) {
        this.exerciseId = exerciseId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName( String playerName ) {
        this.playerName = playerName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore( Integer score ) {
        this.score = score;
    }

    public Exercise getExerciseByExerciseId(){
        return exerciseByExerciseId;
    }

    public void setExerciseByExerciseId(Exercise exercise){
        this.exerciseByExerciseId = exercise;
    }

    @Override
    public boolean equals( Object o ) {
        if( this == o ) return true;
        if( !( o instanceof Score ) ) return false;

        Score that = ( Score ) o;

        if( !exerciseByExerciseId.equals( that.exerciseByExerciseId ) ) return false;
        if( !exerciseId.equals( that.exerciseId ) ) return false;
        if( !id.equals( that.id ) ) return false;
        if( !playerName.equals( that.playerName ) ) return false;
        if( !score.equals( that.score ) ) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + exerciseId.hashCode();
        result = 31 * result + playerName.hashCode();
        result = 31 * result + score.hashCode();
        result = 31 * result + exerciseByExerciseId.hashCode();
        return result;
    }
}

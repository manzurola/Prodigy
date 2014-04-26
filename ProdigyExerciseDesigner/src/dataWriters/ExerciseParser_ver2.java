package dataWriters;

import model.*;
import util.*;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.*;

/**
 * User: guy
 * Date: 3/6/13
 * Time: 1:07 PM
 */
public class ExerciseParser_ver2 extends ExerciseParser {

    List<String> lines;

    /*  for reference by each currently parsed object    */
    int recentQuestionNumber;

    Exercise exercise;

    Set<Question> questions;


    public ExerciseParser_ver2() {
        this.lines = new ArrayList<String>();
    }

    @Override
    public void setData( List<String> lines ) {
        this.lines = lines;
    }

    @Override
    public List<String> getData( List<String> lines ) {
        return lines;
    }

    public void parseAndPersist() throws Exception {

        init();
        List<Pair<String, String>> attributeValueList = extractKeyValue( lines );
        extractKeyValuesAndPopulateVariables( attributeValueList );
        persist();
    }

    /**
     * Initialize class variables before operation
     */
    private void init() {

        exercise = new Exercise();
        exercise.setQuestionsById( new HashSet<Question>() );
        exercise.setNumberOfQuestions( 0 );

        recentQuestionNumber = 0;   //  assigned by sequence

        questions = new HashSet<Question>();
    }

    private void extractKeyValuesAndPopulateVariables( List<Pair<String, String>> attributeValueList ) throws Exception {

        Question currentQuestion = null;
        Blank currentBlank = null;

        for( Pair<String, String> keyValuePair : attributeValueList ) {
            if( keyValuePair.getFirst().equals( "subject" ) ) {
                //  process subject name
                Subject subject = parseSubject( keyValuePair.getSecond() );
                exercise.setSubjectBySubjectName( subject );
            } else if( keyValuePair.getFirst().equals( "difficultyLevel" ) ) {
                //  process difficulty level name
                DifficultyLevel level = parseDifficultyLevel( keyValuePair.getSecond() );
                exercise.setDifficultyLevelsByDifficultyLevelName( level );
            } else if( keyValuePair.getFirst().equals( "title" ) ) {
                //  process exercise title
                String title = keyValuePair.getSecond();
                exercise.setTitle( title );
            } else if( keyValuePair.getFirst().equals( "question" ) ) {
                // process question
                String questionValue = keyValuePair.getSecond();
                currentQuestion =  parseQuestion( questionValue );
                questions.add( currentQuestion );
                //  increment number of questions in exercise
                exercise.setNumberOfQuestions( exercise.getQuestionsById().size() );
                //  increment for next question
                recentQuestionNumber++;
            } else if( keyValuePair.getFirst().equals( "blank" ) ) {
                //  process blank
                currentBlank = parseBlank( keyValuePair.getSecond() );
                currentQuestion.getBlanksById().add( currentBlank );
            } else if( keyValuePair.getFirst().equals( "answer" ) ) {
                //  process answer
                Answer answer = parseAnswer( keyValuePair.getSecond() );
                currentBlank.getAnswers().add( answer );
            }
        }
    }

    /**
     * Persist the class variables to database
     */
    private void persist() {

        Session session = HibernateUtil.currentSession();
        Transaction tx = session.beginTransaction();

        System.out.println("persisting");
        Integer generatedExerciseId = ( Integer ) session.save( exercise );


        for( Question question : questions ) {
            question.setExerciseId( generatedExerciseId );
            Integer generatedQuestionId = (Integer)session.save( question );
            for( Blank blank : question.getBlanksById() ) {
                System.out.println("blank: " + blank.getQuestionId() + ", " + blank.getIndex());
                blank.setQuestionId( generatedQuestionId );
                session.save( blank );
                for( Answer answer : blank.getAnswers() ) {
                    answer.setQuestionId( generatedQuestionId );
                    session.save( answer );
                }
            }
        }


        tx.commit();

        HibernateUtil.closeSession();

    }

    /**
     * Extract key and value from every line
     *
     * @param lines
     * @return a list of key-value pairs
     */
    private List<Pair<String, String>> extractKeyValue( List<String> lines ) {

        String keyValueDelim = "[:]";

        List<Pair<String, String>> attributeValueList = new ArrayList<Pair<String, String>>();
        for( String line : lines ) {
            String[] tokens = line.split( keyValueDelim );
            System.out.println(line);
            attributeValueList.add( new Pair<String, String>( tokens[ 0 ].trim(), tokens[ 1 ].trim() ) );
        }
        return attributeValueList;
    }

    /**
     * @param value = subject name
     * @return
     */
    private Subject parseSubject( String value ) {
        String name = value.trim();
        Subject subject = new Subject();
        subject.setName( name );
        return subject;
    }

    private DifficultyLevel parseDifficultyLevel( String value ) {
        String name = value.trim();
        DifficultyLevel level = new DifficultyLevel();
        level.setName( name );
        return level;
    }

    private Question parseQuestion( String value ) {

        //  value == html
        Question question = new Question();
        question.setIndex( recentQuestionNumber );
        question.setHtml( value );
        question.setBlanksById( new HashSet<Blank>() );

        return question;
    }

    /**
     * @param value string representation of index of blank (integer)
     * @return
     */
    private Blank parseBlank( String value ) {
        Blank blank = new Blank();
        blank.setAnswers( new HashSet<Answer>() );
        blank.setIndex( Integer.valueOf( value ) );
        return blank;
    }

    private Answer parseAnswer( String answerValue ) {

        String delim = "[,]";
        String[] values = answerValue.split( delim );
        Answer answer = new Answer();

        for( int i = 0; i < values.length; i++ ) {
            switch( i ) {
                case 0: //  values[0] = blankNumber
                    answer.setIndex( Integer.valueOf( values[ i ].trim() ) );
                    break;
                case 1: //  values[1] = text
                    answer.setToken( values[ 1 ].trim() );
                    break;
                case 2: //  values[2] = correct
                    if( values[ i ].trim().equals( "1" ) ) {
                        answer.setCorrect( true );
                    } else {
                        answer.setCorrect( false );
                    }
                    break;
                case 3: // values[3] = feedback  - may not exist
                    answer.setFeedback( values[ i ].trim() );
            }
        }
        return answer;
    }

    private DifficultyLevel getDifficultyLevel( String name ) {
        Session session = HibernateUtil.currentSession();

        String hql = "select id from DifficultyLevel where name = :name";
        DifficultyLevel difficultyLevel = new DifficultyLevel();
        try {
            difficultyLevel.setLevel( ( Integer ) session.createQuery( hql ).setString( "name", name ).list().get( 0 ) );
        } catch( HibernateException e ) {
            e.printStackTrace();
        } finally {
            HibernateUtil.closeSession();
        }

        return difficultyLevel;
    }


}

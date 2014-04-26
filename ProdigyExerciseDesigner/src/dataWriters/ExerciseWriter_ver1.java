//package com.manzurola.prodigy.dataWriters;
//
//
//import com.manzurola.prodigy.model.*;
//import com.manzurola.prodigy.util.HibernateUtil;
//import com.manzurola.prodigy.util.Pair;
//import org.hibernate.HibernateException;
//import org.hibernate.Session;
//import org.hibernate.Transaction;
//
//import java.io.FileReader;
//import java.util.*;
//
///**
//* User: guy
//* Date: 3/6/13
//* Time: 1:07 PM
//*/
//public class ExerciseWriter_ver1 extends ExerciseParser {
//
//    /*  for reference by each currently parsed object    */
//    int subjectId;
//    int exerciseId;
//    int recentQuestionNumber;
//
//    Exercise exercise;
//
//
//    /**
//     * read contents of file and populate database through hibernate
//     *
//     * @param filename
//     */
//    public void loadFromFileAndPersistToDatabase( String filename ) throws Exception {
//
//        //  load filename
//        Scanner scanner = new Scanner( new FileReader( filename ) );
//        List<String> lines = new ArrayList<String>();
//        List<Pair<String, String>> attributeValueList = new ArrayList<Pair<String, String>>();
//        try {
//            while( scanner.hasNextLine() ) {
//                String line = scanner.nextLine();
//                lines.add( line );
//            }
//        } catch( Exception e ) {
//            e.printStackTrace();
//        } finally {
//            scanner.close();
//        }
//
//        persistKeyValueMap( extractKeyValue( lines ) );
//    }
//
//    private void persistKeyValueMap( List<Pair<String, String>> attributeValueList ) throws Exception {
//
//        exercise = new Exercise();
//        exercise.setQuestionsById( new HashSet<Question>() );
//        exercise.setNumberOfQuestions( 0 );
//        Question currentQuestion = new Question();
//        //  reset class variables
//        //  questions are assigned a number based on their order of appearance within the document
//        recentQuestionNumber = 0;
//
//        //  load subject
//
//        for( Pair<String, String> keyValuePair : attributeValueList ) {
//            if( keyValuePair.getFirst().equals( "subject" ) ) {
//                //  process subject number
//                //  make sure subject exists before adding exercise
//                Subject subject = getSubject( keyValuePair.getSecond() );
//                if( subject != null ) {
//                    exercise.setSubjectBySubjectId( subject );
//                } else {
//                    throw new IllegalArgumentException( "invalid subject" );
//                }
//            } else if( keyValuePair.getFirst().equals( "difficultyLevel" ) ) {
//                //  process difficulty level
//                DifficultyLevel level = getDifficultyLevel( keyValuePair.getSecond() );
//                exercise.setDifficultyLevelByDifficultyLevel( level );
//            } else if( keyValuePair.getFirst().equals( "title" ) ) {
//                //  process exercise title
//                String title = keyValuePair.getSecond();
//                exercise.setTitle( title );
//            } else if( keyValuePair.getFirst().equals( "question" ) ) {
//                // process question
//                recentQuestionNumber++;    //  start from 1
//                String questionValue = keyValuePair.getSecond();
//
//                //  set current question for following answers
//                currentQuestion = parseQuestion( questionValue );
//                exercise.getQuestionsById().add( currentQuestion );
//
//                exercise.setNumberOfQuestions( exercise.getQuestionsById().size() );
//            } else if( keyValuePair.getFirst().equals( "answer" ) ) {
//                //  process answer
//                String answerValue = keyValuePair.getSecond();
//                Answer answer = parseAnswer( answerValue );
//                currentQuestion.getAnswersById().add( answer );
//            }
//        }
//
//
//
//        Session session = HibernateUtil.currentSession();
//        Transaction tx = session.beginTransaction();
//
//        session.save( exercise );
//        tx.commit();
//
//        HibernateUtil.closeSession();
//    }
//
//    private List<Pair<String, String>> extractKeyValue( List<String> lines ) {
//
//        String keyValueDelim = "[:]";
//
//        List<Pair<String, String>> attributeValueList = new ArrayList<Pair<String, String>>();
//        for( String line : lines ) {
//            String[] tokens = line.split( keyValueDelim );
//            attributeValueList.add( new Pair<String, String>( tokens[ 0 ].trim(), tokens[ 1 ].trim() ) );
//        }
//        return attributeValueList;
//    }
//
//    private Question parseQuestion( String value ) {
//
//        //  value == html
//        Question question = new Question();
//        question.setIndex( recentQuestionNumber );
//        question.setHtml( value );
//        question.setAnswersById( new HashSet<Answer>() );
//
//        return question;
//    }
//
//    private Answer parseAnswer( String answerValue ) {
//
//        String delim = "[,]";
//        String[] values = answerValue.split( delim );
//        Answer answer = new Answer();
//
//        for( int i = 0; i < values.length; i++ ) {
//            switch( i ) {
//                case 0: //  values[0] = blankNumber
//                    answer.setIndex( Integer.valueOf( values[ i ].trim() ) );
//                    break;
//                case 1: //  values[1] = text
//                    answer.setToken( values[ 1 ].trim() );
//                    break;
//                case 2: //  values[2] = correct
//                    if( values[ i ].trim().equals( "1" ) ) {
//                        answer.setCorrect( true );
//                    } else answer.setCorrect( false );
//                    break;
//                case 3: // values[3] = feedback  - may not exist
//                    answer.setFeedback( values[ i ].trim() );
//            }
//        }
//        return answer;
//    }
//
//    private Subject getSubject( String name ) {
//        Session session = HibernateUtil.currentSession();
//
//        String hql = "select id from Subject where name = :sName";
//        Subject subject = new Subject();
//        try {
//            subject.setId( ( Integer ) session.createQuery( hql ).setString( "sName", name ).list().get( 0 ) );
//        } catch( HibernateException e ) {
//            e.printStackTrace();
//        } finally {
//            HibernateUtil.closeSession();
//        }
//
//        return subject;
//    }
//
//    private DifficultyLevel getDifficultyLevel( String name ) {
//        Session session = HibernateUtil.currentSession();
//
//        String hql = "select id from DifficultyLevel where name = :name";
//        DifficultyLevel difficultyLevel = new DifficultyLevel();
//        try {
//            difficultyLevel.setLevel( ( Integer ) session.createQuery( hql ).setString( "name", name ).list().get( 0 ) );
//        } catch( HibernateException e ) {
//            e.printStackTrace();
//        } finally {
//            HibernateUtil.closeSession();
//        }
//
//        return difficultyLevel;
//    }
//
//}

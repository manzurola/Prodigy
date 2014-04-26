package com.manzurola.prodigy.resources;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.manzurola.prodigy.model.*;
import com.manzurola.prodigy.util.HibernateUtil;
import org.hibernate.HibernateException;
import org.hibernate.Session;

import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Collection;

/**
 * User: guy
 * Date: 2/3/13
 * Time: 7:24 PM
 */
@Path("exercises")
public class ExerciseResource {

    @Context
    Request request;

    @Context
    UriInfo uriInfo;

    /**
     * {
     * “exercises“:   [
     * {
     * “title”: 				STRING,
     * “difficultyLevel”: 		{ “name”: 	STRING	},
     * “numberOfQuestions”:    NUMBER,
     * “questions”: 			{ “href”: URI	}
     * },
     * ...										//all exercises
     * ]
     * }
     *
     * @param subjectName
     * @return
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getExercisesBySubject( @QueryParam("subject") String subjectName ) {

        //  TODO: regular expression in subject name query param / assert not null

        //  open hibernate session
        Session session;
        try {
            session = HibernateUtil.currentSession();
        } catch( HibernateException ex ) {
            ex.printStackTrace();
            HibernateUtil.closeSession();
            return Response.status( Response.Status.NOT_FOUND ).build();
        }

        Subject subject = ( Subject ) session.get( Subject.class, subjectName );
        if( subject == null ) {
            //  no matching subject found
            HibernateUtil.closeSession();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        Collection<Exercise> exercises = subject.getExercisesByName();

        /****   create json response object ****/
        JsonFactory factory = new JsonFactory();
        Writer sWriter = new StringWriter();
        try {
            JsonGenerator generator = factory.createGenerator( sWriter );
            generator.writeStartObject();
            generator.writeFieldName( "exercises" );
            generator.writeStartArray();            //  begin exercises array
            for( Exercise exercise : exercises ) {
                generator.writeStartObject();           //  begin exercise object
                generator.writeStringField( "title", exercise.getTitle() );
                generator.writeNumberField( "numberOfQuestions", exercise.getNumberOfQuestions() );

                //  create reference to this exercise for fetching all data
                String href = UriBuilder.fromUri( uriInfo.getAbsolutePath() ).path( "{id}" ).build( exercise.getId() ).toString();
                generator.writeStringField( "href", href );

                //  write questions URI locator
                generator.writeFieldName( "questions" );
                generator.writeStartObject();
                generator.writeStringField( "href", getQuestionsURI( exercise.getId() ) );
                generator.writeEndObject();

                //  write difficulty level object
                generator.writeFieldName( "difficultyLevel" );
                generator.writeStartObject();
                generator.writeStringField( "name", exercise.getDifficultyLevelName() );
                generator.writeEndObject();

                //  write subject object
                generator.writeFieldName( "subject" );
                generator.writeStartObject();
                generator.writeStringField( "name", exercise.getSubjectName() );
                generator.writeEndObject();

                generator.writeEndObject();         //  end exercise object
            }
            generator.writeEndArray();      //  end of exercises array
            generator.writeEndObject();     //  end of response object
            generator.close();
        } catch( IOException e ) {
            e.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        } finally {
            HibernateUtil.closeSession();
        }

        return Response.ok( sWriter.toString() ).build();
    }

    /**
     * @param id
     * @return all data required to play an exercise
     */
    @GET
    @Path( "{id}" )
    @Produces( MediaType.APPLICATION_JSON )
    public Response getExercise( @PathParam( "id" ) int id ) {

        //  open hibernate session
        Session session;
        try {
            session = HibernateUtil.currentSession();
        } catch( HibernateException ex ) {
            ex.printStackTrace();
            HibernateUtil.closeSession();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        Exercise exercise = ( Exercise ) session.get( Exercise.class, id );
        if( exercise == null ) {
            //  no matching exercise found
            HibernateUtil.closeSession();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        /****   create json response object ****/
        JsonFactory factory = new JsonFactory();
        Writer sWriter = new StringWriter();
        try {
            JsonGenerator generator = factory.createGenerator( sWriter );
            generator.writeStartObject();
            generator.writeFieldName( "exercise" );
            generator.writeStartObject();

            //  write subject object
            generator.writeFieldName( "subject" );
            generator.writeStartObject();
            generator.writeStringField( "name", exercise.getSubjectName() );
            generator.writeEndObject();

            //  write difficulty level object
            generator.writeFieldName( "difficultyLevel" );
            generator.writeStartObject();
            generator.writeStringField( "name", exercise.getDifficultyLevelsByDifficultyLevelName().getName() );
            generator.writeNumberField( "level", exercise.getDifficultyLevelsByDifficultyLevelName().getLevel() );
            generator.writeEndObject();

            generator.writeStringField( "title", exercise.getTitle() );
            generator.writeNumberField( "numberOfQuestions", exercise.getNumberOfQuestions() );

            //  write questions
            generator.writeFieldName( "questions" );
            generator.writeStartArray();
            for( Question question : exercise.getQuestionsSortByIdx() ) {
                generator.writeStartObject();           //  begin question object
                generator.writeStringField( "html", question.getHtml() );

                //  write blanks
                generator.writeFieldName( "blanks" );
                generator.writeStartArray();
                for( Blank blank : question.getBlanksSortByIdx() ) {
                    generator.writeStartObject();           //  begin blank object

                    //  write answers
                    generator.writeFieldName( "answers" );
                    generator.writeStartArray();
                    for( Answer answer : blank.getAnswers() ) {
                        generator.writeStartObject();           //  begin answer object
                        generator.writeStringField( "token", answer.getToken() );
                        generator.writeBooleanField( "correct", answer.getCorrect() );

                        //  write feedback only if not null
                        String feedback = answer.getFeedback();
                        if( feedback != null ) {
                            generator.writeStringField( "feedback", feedback );
                        }
                        generator.writeEndObject();             //  end answer object
                    }
                    generator.writeEndArray();
                    generator.writeEndObject();             //  end blank object
                }
                generator.writeEndArray();
                generator.writeEndObject();             //  end question object
            }
            generator.writeEndArray();      //  end of questions array
            generator.writeEndObject();     //  end of response object
            generator.close();
        } catch( IOException e ) {
            e.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        } finally {
            HibernateUtil.closeSession();
        }

        return Response.ok( sWriter.toString() ).build();
    }


/*      NOT IN USE  */
//    @GET
//    @Path("{id}/top20")
//    @Produces( MediaType.APPLICATION_JSON )
//    public Response topTwenty(@PathParam( "id" ) int id){
//
//        //  open hibernate session
//        Session session;
//        try {
//            session = HibernateUtil.currentSession();
//        } catch( HibernateException ex ) {
//            ex.printStackTrace();
//            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
//        }
//
//        Exercise exercise = ( Exercise ) session.get( Exercise.class, id );
//        if( exercise == null ) {
//            //  no matching exercise found
//            return Response.status( Response.Status.NOT_FOUND ).build();
//        }
//
//        Collection<Score> topScores = exercise.getTopScores();
//        //topScores.iterator().next();
//
//        return Response.ok( topScores.iterator().next().getExerciseByExerciseId() ).build();
//    }

    private String getQuestionsURI( int exerciseId ) {
        return UriBuilder.fromUri( uriInfo.getBaseUri() ).path( QuestionResource.class ).queryParam( "exerciseId", exerciseId ).build().toString();
    }


}
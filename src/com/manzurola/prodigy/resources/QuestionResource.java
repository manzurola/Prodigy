package com.manzurola.prodigy.resources;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;

import com.manzurola.prodigy.model.Exercise;
import com.manzurola.prodigy.model.Question;
import com.manzurola.prodigy.util.HibernateUtil;
import org.hibernate.*;

import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * User: guy
 * Date: 2/27/13
 * Time: 10:51 PM
 */
@Path( "questions" )
public class QuestionResource {

    @Context
    Request request;

    @Context
    UriInfo uriInfo;

    @GET
    @Produces( MediaType.APPLICATION_JSON )
    public Response getQuestionsByExercise( @QueryParam( "exerciseId" ) int exerciseId ) {

        //  open hibernate session
        Session session;
        try {
            session = HibernateUtil.currentSession();
        } catch( HibernateException ex ) {
            ex.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        Exercise exercise = (Exercise)session.get( Exercise.class, exerciseId );
        if( exercise == null ){
            return Response.status( Response.Status.NO_CONTENT ).build();
        }

        Collection<Question> questions = exercise.getQuestionsById();
        String json = "";
        try{
            json = createJsonFromQuestions( questions );
        }catch( Exception e ){
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }finally {
            HibernateUtil.closeSession();
        }

        return Response.ok( json ).build();
    }

    @GET
    @Path( "{id}" )
    @Produces( MediaType.APPLICATION_JSON )
    public Response getQuestion( @PathParam( "id" ) int id ) {
        return Response.ok( "QuestionResource_getQuestion" ).build();
    }

    @GET
    @Path( ( "{id}/answers" ) )
    @Produces( MediaType.APPLICATION_JSON )
    public Response getAnswersForQuestion( @PathParam( "id" ) int id ) {
        return Response.ok( "QuestionResource_getAnswersForQuestion" ).build();
    }

    /**
     * Creates a string json representation of a collection of questions.
     * Returned string has the following format:
     {
         “questions”:[
                         {
                         “index”:		NUMBER,
                         “html”: 		STRING,
                         “answers”:	    URI
                         },
                         ...			//all questions
                     ]
     }
     * @param questions
     * @return
     * @throws IOException
     * @throws JsonGenerationException
     */
    private String createJsonFromQuestions( Collection<Question> questions ) throws JsonGenerationException, IOException{
        JsonFactory factory = new JsonFactory();
        Writer sWriter = new StringWriter();
        try {
            JsonGenerator generator = factory.createGenerator( sWriter );
            generator.writeStartObject();
            generator.writeFieldName( "questions" );
            generator.writeStartArray();
            for( Question question : questions ) {
                generator.writeStartObject();
                generator.writeStringField( "html", question.getHtml() );
                generator.writeNumberField( "index", question.getIndex() );
                generator.writeFieldName( "answers" );
                generator.writeStartObject();       //  start answers object
                generator.writeStringField( "href", getAnswersURI( question.getId() ) );
                generator.writeEndObject();         //  end answers object
                generator.writeEndObject();         //  end question object
            }

            generator.writeEndArray();
            generator.writeEndObject();
            generator.close();
        } catch( JsonGenerationException e ) {
            e.printStackTrace();
            throw e;
        } catch( IOException e ) {
            e.printStackTrace();
            throw e;
        } finally {
            sWriter.close();
        }
        return sWriter.toString();
    }


    /**
     * Gets a String URI that points to the answers that belong to supplied question id.
     * @param questionId
     * @return
     */
    private String getAnswersURI( int questionId ) {
        return UriBuilder.fromResource( AnswerResource.class ).queryParam( "questionId", questionId ).build().toString();
    }

    private List<String> createURIs( UriInfo uriInfo, List<Integer> questionIds ) {
        List<String> uris = new ArrayList<String>( questionIds.size() );
        for( Integer id : questionIds ) {
            uris.add( UriBuilder.fromUri( uriInfo.getAbsolutePath() ).path( "{id}" ).build( id ).toString() );
        }
        return uris;
    }

}

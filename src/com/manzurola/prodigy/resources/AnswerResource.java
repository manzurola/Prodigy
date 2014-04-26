package com.manzurola.prodigy.resources;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.manzurola.prodigy.model.Answer;
import com.manzurola.prodigy.model.Question;
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
 * Date: 2/28/13
 * Time: 7:16 PM
 */
@Path("answers")
public class AnswerResource {

    @Context
    Request request;

    @Context
    UriInfo uriInfo;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAnswersByQuestion( @QueryParam( "questionId" ) int questionId ) {
        //  open hibernate session
        Session session;
        try {
            session = HibernateUtil.currentSession();
        } catch( HibernateException ex ) {
            ex.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        /*  get answers where questionId = supplied question id */
        String hql = "from Answer where questionId = :questionId";
        Collection<Answer> answers;
        try {
            answers = session.createQuery( hql ).setParameter( "questionId", questionId ).list();
            if( answers.size() == 0){
                //  no answers found (no such question exists)
                return Response.status( Response.Status.NO_CONTENT ).build();
            }
        } catch( HibernateException e ) {
            e.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        /*  create json response from retrieved collection  */
        String json = "";
        try {
            json = createJsonFromAnswers( answers );
        } catch( Exception e ) {
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        } finally {
            HibernateUtil.closeSession();
        }

        return Response.ok( json ).build();
    }

    /**
     {
         “answers”:	 [
                         {
                         “token” :		STRING
                         “index”: 		NUMBER
                         “correct”: 	BOOLEAN
                         “feedback”:    STRING
                         },
                         ... 			//all answers
                     ]
     }
     * @param answers
     * @return
     * @throws JsonGenerationException
     * @throws IOException
     */
    private String createJsonFromAnswers( Collection<Answer> answers ) throws JsonGenerationException, IOException {
        JsonFactory factory = new JsonFactory();
        Writer sWriter = new StringWriter();
        try {
            JsonGenerator generator = factory.createGenerator( sWriter );
            generator.writeStartObject();
            generator.writeFieldName( "answers" );
            generator.writeStartArray();
            for( Answer answer : answers ) {
                generator.writeStartObject();      //   begin answer object
                generator.writeStringField( "token", answer.getToken() );
                generator.writeNumberField( "index", answer.getIndex() );

                //  make sure feedback is not null
                String feedback = answer.getFeedback();
                if( feedback != null ) {
                    generator.writeStringField( "feedback", feedback );
                }

                //  write question object
                generator.writeFieldName( "question" );
                generator.writeStartObject();
                generator.writeStringField( "href", getQuestionURI( answer.getQuestionId() ) );
                generator.writeEndObject();         //  end question object

                generator.writeEndObject();         //  end answer object
            }

            generator.writeEndArray();              //  end array of answers
            generator.writeEndObject();             //  end answers object
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

    private String getQuestionURI( int questionId ) {
        return UriBuilder.fromResource( QuestionResource.class ).path( "{id}" ).build( questionId ).toString();
    }
}

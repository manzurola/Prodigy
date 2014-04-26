package com.manzurola.prodigy.resources;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.manzurola.prodigy.model.Subject;
import com.manzurola.prodigy.util.HibernateUtil;
import org.hibernate.HibernateException;
import org.hibernate.Session;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.*;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.List;

/**
 * User: Guy
 * Date: 1/28/13
 * Time: 12:23 AM
 */
@Path( "subjects" )
public class SubjectResource {

    @Context
    Request request;

    @Context
    UriInfo uriInfo;

    /**
     * Returns all subjects. The response is built as follows:
     *
         {
            “subjects”:	[
                            {
                            “number”: 				NUMBER,
                            “name”: 				STRING,
                            “numberOfExercises”: 	NUMBER,
                            “exercises”:			{ “href”: URI	}
                            }
                            . . .					//all subjects
                        ]
         }

     The href pointing to exercises is used to fetch all exercises that belong to this subject.

     * @return
     */
    @GET
    @Produces( MediaType.APPLICATION_JSON )
    public Response getSubjects(){

        //  open hibernate session
        Session session;
        try{
            session = HibernateUtil.currentSession();
        }catch( HibernateException ex ){
            ex.printStackTrace();
            HibernateUtil.closeSession();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        /****   get persistent data ****/
        String hql = "from Subject";
        List<Subject> subjects;
        try{
            subjects = (List<Subject>) session.createQuery( hql ).list();
        }catch( HibernateException e ){
            e.printStackTrace();
            HibernateUtil.closeSession();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        /****   create json response object ****/
        JsonFactory factory = new JsonFactory();
        Writer sWriter = new StringWriter();
        try {
            JsonGenerator generator = factory.createGenerator( sWriter );
            generator.writeStartObject();
            generator.writeFieldName( "subjects" );
            generator.writeStartArray();
            for( Subject subject : subjects ) {
                generator.writeStartObject();   //  open subject object
                generator.writeStringField( "name", subject.getName() );
                generator.writeNumberField( "numberOfExercises", subject.getNumberOfExercises() );
                generator.writeFieldName( "exercises");
                generator.writeStartObject();   //      open exercises object
                generator.writeStringField( "href", getExercisesURIs( subject.getName() ) );
                generator.writeEndObject();     //      close exercises object
                generator.writeEndObject();     //  close subject object
            }
            generator.writeEndArray();
            generator.writeEndObject();
            generator.close();
        } catch( JsonGenerationException ex ) {
            ex.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        } catch( IOException ex ) {
            ex.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }finally {
            HibernateUtil.closeSession();
        }
        return Response.ok( sWriter.toString() ).build();
    }

    /**
     * Builds and returns a string representation of the URI for getting all exercises that belong to supplied subject
     * @param subjectName the identifier of a subject
     * @return
     */
    private String getExercisesURIs( String subjectName ){
        return UriBuilder.fromUri( uriInfo.getBaseUri() ).path( ExerciseResource.class ).queryParam( "subject", subjectName ).build(  ).toString();
    }


}

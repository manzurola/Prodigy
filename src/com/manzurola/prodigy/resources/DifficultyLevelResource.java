package com.manzurola.prodigy.resources;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.manzurola.prodigy.model.DifficultyLevel;
import com.manzurola.prodigy.model.Question;
import com.manzurola.prodigy.util.HibernateUtil;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import sun.text.resources.CollationData_lt;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.*;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Collection;

/**
 * User: guy
 * Date: 3/2/13
 * Time: 5:33 PM
 */
@Path("difficultyLevels")
public class DifficultyLevelResource {

    @Context
    Request request;

    @Context
    UriInfo uriInfo;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDifficultyLevels() {
        //  open hibernate session
        Session session;
        try {
            session = HibernateUtil.currentSession();
        } catch( HibernateException ex ) {
            ex.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        String hql = "from DifficultyLevel order by level";
        Collection<DifficultyLevel> difficultyLevels = null;
        try {
            difficultyLevels = session.createQuery( hql ).list();
        } catch( HibernateException e ) {
            e.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        String json = "";
        try{
            json = createJsonFromDifficultyLevels( difficultyLevels );
        }catch( Exception e ){
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }finally {
            HibernateUtil.closeSession();
        }
        return Response.ok( json ).build();
    }

    /**
     {
         “difficultyLevels”: [
                                 {
                                 “level”: 	NUMBER
                                 “name”: 	STRING
                                 },
                                 ...				// all difficulty levels
                             ]
     }
     *
     * @param difficultyLevels
     * @return
     * @throws JsonGenerationException
     * @throws IOException
     */
    private String createJsonFromDifficultyLevels( Collection<DifficultyLevel> difficultyLevels ) throws JsonGenerationException, IOException {
        JsonFactory factory = new JsonFactory();
        Writer sWriter = new StringWriter();
        try {
            JsonGenerator generator = factory.createGenerator( sWriter );
            generator.writeStartObject();
            generator.writeFieldName( "difficultyLevels" );
            generator.writeStartArray();
            for( DifficultyLevel difficultyLevel : difficultyLevels ) {
                generator.writeStartObject();
                generator.writeStringField( "name", difficultyLevel.getName() );
                generator.writeNumberField( "level", difficultyLevel.getLevel() );
                generator.writeEndObject();
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
}

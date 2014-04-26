package com.manzurola.prodigy.resources;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.manzurola.prodigy.model.Score;

/**
 * User: guy
 * Date: 4/7/13
 * Time: 1:52 PM
 */
@Path("scoreboards")
public class TopScoresResource {

    @GET
    @Path("{exercise}")
    @Produces( MediaType.APPLICATION_JSON )
    public Response topTwenty(@PathParam( "{exercise}" ) int exerciseId){
        return null;
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response submitScore(Score score){
        //  If the score is in the top twenty
        //      submit score, and return the generated id of the score entity
        //  else return false
        return null;
    }

    @GET
    @Path("{exercise}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response isNewTopScore(@PathParam( "exercise" ) int exerciseId, @QueryParam( "score" ) int score){
        return null;
    }
}

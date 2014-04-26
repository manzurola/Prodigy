package com.manzurola.prodigy.resources;

import com.manzurola.prodigy.model.User;
import com.manzurola.prodigy.util.HibernateUtil;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.Console;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Calendar;

/**
 * User: guy
 * Date: 4/1/13
 * Time: 7:13 PM
 */
@Path("users")
public class UsersResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        System.out.println("ALL!!!!!!!!!!!!!!!");
        return null;
    }


    @GET
    @Path( "{id}" )
    @Produces( MediaType.APPLICATION_JSON )
    public Response getUser(@PathParam( "id" ) int id){


        //  open hibernate session
        Session session;
        try {
            session = HibernateUtil.currentSession();
        } catch( HibernateException ex ) {
            ex.printStackTrace();
            return Response.status( Response.Status.INTERNAL_SERVER_ERROR ).build();
        }

        //  test reg user
        User u = new User();
        u.setUsername( "guy" );
        u.setPassword( "guy" );
        Timestamp regDate = new Timestamp( Calendar.getInstance().getTime().getTime() );
        u.setJoinTime( regDate );
        u.setLastLogTime( regDate );

        Transaction tx = session.beginTransaction();
        session.save( u );
        tx.commit();

        //User user = ( User ) session.get( User.class, idNew );

        HibernateUtil.closeSession();

        if( u != null ){
            return Response.ok( u ).build();
        }
        else{
            return Response.status( Response.Status.NOT_FOUND ).build();
        }
    }
}

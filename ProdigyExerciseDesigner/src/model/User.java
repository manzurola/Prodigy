package model;

import java.sql.Timestamp;

/**
 * User: guy
 * Date: 4/1/13
 * Time: 9:12 PM
 */
public class User {
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername( String username ) {
        this.username = username;
    }

    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword( String password ) {
        this.password = password;
    }

    private Integer id;

    public Integer getId() {
        return id;
    }

    public void setId( Integer id ) {
        this.id = id;
    }

    private Timestamp joinTime;

    public Timestamp getJoinTime() {
        return joinTime;
    }

    public void setJoinTime( Timestamp joinTime ) {
        this.joinTime = joinTime;
    }

    private Timestamp lastLogTime;

    public Timestamp getLastLogTime() {
        return lastLogTime;
    }

    public void setLastLogTime( Timestamp lastLogTime ) {
        this.lastLogTime = lastLogTime;
    }

    @Override
    public boolean equals( Object o ) {
        if( this == o ) return true;
        if( o == null || getClass() != o.getClass() ) return false;

        User user = ( User ) o;

        if( id != null ? !id.equals( user.id ) : user.id != null ) return false;
        if( joinTime != null ? !joinTime.equals( user.joinTime ) : user.joinTime != null ) return false;
        if( lastLogTime != null ? !lastLogTime.equals( user.lastLogTime ) : user.lastLogTime != null ) return false;
        if( password != null ? !password.equals( user.password ) : user.password != null ) return false;
        if( username != null ? !username.equals( user.username ) : user.username != null ) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = username != null ? username.hashCode() : 0;
        result = 31 * result + ( password != null ? password.hashCode() : 0 );
        result = 31 * result + ( id != null ? id.hashCode() : 0 );
        result = 31 * result + ( joinTime != null ? joinTime.hashCode() : 0 );
        result = 31 * result + ( lastLogTime != null ? lastLogTime.hashCode() : 0 );
        return result;
    }
}

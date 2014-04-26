package com.manzurola.prodigy;



import com.manzurola.prodigy.model.User;
import com.manzurola.prodigy.resources.*;

import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

/**
 * User: guy
 * Date: 3/2/13
 * Time: 5:42 PM
 */
public class ProdigyApplication extends Application {

    private Set<Object> singletons = new HashSet<Object>();
    private Set<Class<?>> classes = new HashSet<Class<?>>();

    public ProdigyApplication() {

        singletons.add( new SubjectResource() );
        singletons.add( new ExerciseResource() );
        singletons.add( new QuestionResource() );
        singletons.add( new AnswerResource() );
        singletons.add( new DifficultyLevelResource() );
        singletons.add( new UsersResource() );

        classes.add( SubjectResource.class );
        classes.add( ExerciseResource.class );
        classes.add( QuestionResource.class );
        classes.add( AnswerResource.class );
        classes.add( DifficultyLevelResource.class );
        classes.add( UsersResource.class );
    }

    @Override
    public Set<Class<?>> getClasses() {
        return classes;
    }

    @Override
    public Set<Object> getSingletons() {
        return singletons;
    }
}

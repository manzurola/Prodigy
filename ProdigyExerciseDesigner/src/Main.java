import dataWriters.*;

/**
 * User: guy
 * Date: 4/11/13
 * Time: 7:09 PM
 */
public class Main {

    public static void main( final String[] args ) throws Exception {

        ExerciseParser parser = ExerciseParser.getWriter( "Data/Exercises/rewrite_it_data.txt" );
        parser.parseAndPersist();
    }
}

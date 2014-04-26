package dataWriters;

import util.*;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * User: guy
 * Date: 3/8/13
 * Time: 4:26 PM
 */
public abstract class ExerciseParser {

    private enum Version {
        VERSION_1( "v1" ),
        VERSION_2( "v2" );

        private final String token;

        private Version( String token ) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }

        public static Version byToken( String token ) {
            if( token.equals( VERSION_1.getToken() ) ) {
                return VERSION_1;
            } else if( token.equals( VERSION_2.getToken() ) ) {
                return VERSION_2;
            } else {
                return null;
            }
        }
    }

    public abstract void setData(List<String> lines);

    public abstract List<String> getData(List<String> lines);

    /**
     * Extracts a token referencing the version to be used from the first line in the file,
     * Finds the matching Version enum and returns getParser( Version version )
     *
     * @param filename the first line in file is the version of parser to be used and should be
     *                 removed before forwarding file contents to parser instances
     * @return an appropriate ExerciseParser object, or null if an exception occurred during process.
     */
    public static ExerciseParser getWriter( String filename ) {
        List<String> lines = new ArrayList<String>();
        List<Pair<String, String>> attributeValueList = new ArrayList<Pair<String, String>>();
        Scanner scanner = null;
        Version writerVersion = null;
        try {
            scanner = new Scanner( new FileReader( filename ) );
            //  first line is version identifier
            writerVersion = parseVersion( scanner.nextLine() );
            while( scanner.hasNext() ){
                lines.add( scanner.nextLine() );
            }
        } catch( Exception e ) {
            e.printStackTrace();
        } finally {
            if( scanner != null ) {
                scanner.close();
            }
        }
        ExerciseParser parser = getParser( writerVersion );
        parser.setData( lines );
        return parser;
    }

    /**
     * Returns an ExerciseParser based on the supplied version
     *
     * @param writerVersion
     * @return
     */
    public static ExerciseParser getParser( Version writerVersion ) {
        ExerciseParser writer = null;
        switch( writerVersion ) {
            case VERSION_1:
                break;
            case VERSION_2:
                writer = new ExerciseParser_ver2();
                break;
        }
        return writer;
    }

    public static Version parseVersion( String token ) {
        String parsedToken = token.trim();
        return Version.byToken( token );
    }

    public abstract void parseAndPersist() throws Exception;
}

package util;

/**
 * Generic pair class.
 * @author Guy Manzurola
 *
 * @param <FIRST>
 * @param <SECOND>
 */
public final class Pair<FIRST,SECOND>{
	private FIRST first;
	private SECOND second;
	
	public Pair(FIRST first, SECOND second){
		this.first = first;
		this.second = second;
	}
	
	public FIRST getFirst(){
		return first;
	}

    public void setFirst( FIRST first ) {
        this.first = first;
    }

    public SECOND getSecond(){
		return second;
	}

    public void setSecond( SECOND second ) {
        this.second = second;
    }
}

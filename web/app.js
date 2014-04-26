/**
 * Created with IntelliJ IDEA.
 * User: guy
 * Date: 10/29/13
 * Time: 1:04 AM
 * To change this template use File | Settings | File Templates.
 */

window.onload = function() {
    APP.init();
};

var APP = (function() {

    var currentActivity;

    function _onRedirect(){

    }

    function _init(){
        window.addEventListener("message", _onMessage, false);
        currentActivity =
    }

    function _onMessage(e) {
        switch(e.data.messageId){
            case "redirect" :
                logIt("redirect message received");
                break;
        }
    }

    return {
        init : _init(),
        onRedirect : function(func, data){}
    }
}());
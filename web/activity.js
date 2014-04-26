/**
 * Created with IntelliJ IDEA.
 * User: guy
 * Date: 10/28/13
 * Time: 10:01 PM
 * To change this template use File | Settings | File Templates.
 */
var ACTIVITY = (function() {

    function _init() {
        window.addEventListener("message", _onMessage, false);
    }

    function _onMessage(e){
        switch (e.data.messageId) {
            case "start":
                logIt("start event received");
                break;
            case "pause":
                logIt("pause event received");
                break;
            case "stop":
                logIt("stop event received");
                break;
        }
    }

    return {
        init    : function(handler, data) {
        },
        onStart : function(handler, data) {
        },
        onResume: function(handler, data) {
        },
        onPause : function(handler, data) {
        },
        onStop  : function(handler, data) {
        }
    }

}());

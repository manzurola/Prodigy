/**
 * Created with IntelliJ IDEA.
 * User: guy
 * Date: 10/26/13
 * Time: 12:17 AM
 * To change this template use File | Settings | File Templates.
 */

var myEntity = function() {

    var e = document.createElement("div");
    var that = entity(e, {num: 3});
    return that;
};

var messenger = new Messenger();

window.onload = function(){
    logIt("test screen loaded");
    var data = {};
    APPLICATION.do();
    messenger.postMessage("hello world message from iframe");
};

/**
 * User: guyman
 * Date: 1/11/14
 * Time: 9:25 PM
 */

var page, game, data;
window.onload = function() {
    page = document.getElementById('page');
    data = getGameDate();
    game = new Game(page, data);
    game.start();
};

function getGameDate() {
    return new GameData();
}
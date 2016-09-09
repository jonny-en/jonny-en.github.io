var height = (window.innerHeight < 540 ? window.innerHeight : 540);
 
var game = new Phaser.Game(window.innerWidth, height, Phaser.AUTO, 'game'),
    data = new GameState();

var Main = function() {}

Main.prototype = {

    preload: function() {

        game.load.script('game', 'states/Game.js');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },

    create: function() {
        //new Game Data (maybe wrong place)
        var startPlanetID = game.rnd.integerInRange(0, data.solarSystems[0].planets.length - 1);
        data.solarSystems[0].planets[startPlanetID].discovered = true;
        data.solarSystems[0].planets[startPlanetID].name = "Home Planet";

        game.stage.backgroundColor = "0x000000";
        game.stage.disableVisibilityChange = true;


        game.state.add('Game', Game);
        setTimeout(function() {
            game.state.start("Game");
        }, 1000);
    }

};

game.state.add('Main', Main);
game.state.start('Main');

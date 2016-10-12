var Game = function() {},
    fontStyles = {
        small_white: {
            font: "10px PressStart",
            fill: "#ffffff"
        },
        small_black: {
            font: "10px PressStart",
            fill: "#000000"
        },
        small_digital: {
            font: "10px PressStart",
            fill: "#dae27e"
        },
        medium_black: {
            font: "18px PressStart",
            fill: "#000000",
        },
        medium_digital: {
            font: "18px PressStart",
            fill: "#dae27e"
        },
        big_black: {
            font: "23px PressStart",
            fill: "#000000"
        },
        slot_black: {
            font: "50px PressStart",
            fill: "#000000"
        }
    };

Game.prototype = {

    loadScripts: function() {
        game.load.script('solarsystem', 'states/SolarSystem.js');
        game.load.script('WebFont', 'libs/webfontloader.js');
    },

    loadImages: function() {
        game.load.image('background', 'img/background.png');

        game.load.image('planet2', 'img/planet1.png');
        game.load.image('planet1', 'img/planet2.png');
        game.load.image('planet3', 'img/planet3.png');
        game.load.image('planet4', 'img/planet4.png');

        game.load.image('sun', 'img/sun.png');

        game.load.image('overlay', 'img/ovl.png');

        game.load.image('slot_default', 'img/slots/slot_default.png');
        game.load.image('slot_default_w', 'img/slots/slot_default_w.png');
        game.load.image('slot_mine', 'img/slots/slot_mine.png');
        game.load.image('slot_build', 'img/slots/slot_build.png');
        game.load.image('slot_res', 'img/slots/slot_res.png');
        game.load.image('slot_delete', 'img/slots/slot_delete.png');
        game.load.image('slot_back', 'img/slots/slot_back.png');
        game.load.image('slot_accept', 'img/slots/slot_accept.png');
        game.load.image('slot_accept_dis', 'img/slots/slot_accept_dis.png');

        game.load.image('slot_port', 'img/slots/slot_port.png');



    },

    loadFonts: function() {
        WebFontConfig = {
            custom: {
                families: ['PressStart', 'Oxygen'],
                urls: ['assets/style/PressStart.css']
            }
        }
    },


    init: function() {
    },

    preload: function() {
        this.loadScripts();
        this.loadImages();
        this.loadFonts();
    },

    addGameStates: function() {
        game.state.add("SolarSystem", SolarSystem);
    },

    create: function() {
        this.addGameStates();
        this.timer = game.time.ev

        setTimeout(function() {
            game.state.start("SolarSystem");
        }, 1000);
    }
};

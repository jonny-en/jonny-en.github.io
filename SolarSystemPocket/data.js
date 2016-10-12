//ENUMs
var Resource = {
    COIN: 'Coin',
    IRON: 'Iron',
    CARBON: 'Carbon',
    OXYGEN: 'Oxygen',
    parameters: {
        Coin: { shortform: 'Coin', duration: '200' },
        Iron: { shortform: 'Fe', duration: 2 },
        Carbon: { shortform: 'C', duration: 1 },
        Oxygen: { shortform: 'O', duration: 3 }
    }
};


var Prices = {
    def: [Resource.COIN, 200000],
    Fe_1: [Resource.COIN, 400, Resource.CARBON, 20],
    C_1: [Resource.COIN, 200],
    O_1: [Resource.COIN, 800, Resource.IRON, 10, Resource.CARBON, 40],
    Port_1: [Resource.COIN, 1000, Resource.CARBON, 1]
};

//Objects 

function GameState() {
    this.solarSystems = [];
    this.solarSystems.push(new SolarSystem());
    this.solarSystems[0].generatePlanets();

    this.player = new Player();
};

GameState.prototype = {
    constructor: GameState
}

function Player() {
    this.name = 'Jonas';
    this.uc = 10000;
}

Player.prototype = {
    constructor: Player
}

function SolarSystem() {
    this.name = 'System#' + game.rnd.integerInRange(100000, 999999);
    this.sun = new Sun();
    this.planets = [];
}

SolarSystem.prototype = {
    constructor: SolarSystem,
    generatePlanets: function() {
        var dist = game.rnd.integerInRange(30, 50);
        while (dist <= 100) {
            this.planets.push(new Planet(dist));
            dist += game.rnd.integerInRange(7.5, 20);
        }
    }
}

function Sun() {
    this.name = 'Name';
    this.radius = game.rnd.integerInRange(800000, 1390000);
}

Sun.prototype = {
    constructor: Sun
}

function Planet(dist) {
    this.planetnr = game.rnd.integerInRange(1, 4);
    this.name = 'Planet#' + game.rnd.integerInRange(100000, 999999);
    this.radius = game.rnd.integerInRange(3400, 70000);
    this.distance = dist;
    this.speed = Math.sqrt(1 / dist);
    this.discovered = false;
    this.resources = generateResources(this);
    this.slots = [];
    this.slots.push(new Empty());
    this.slots.push(new Empty());
    this.slots.push(new Empty());
    this.buildings = [];
    this.flora = game.rnd.integerInRange(0, 1);
    this.fauna = (this.flora ? game.rnd.integerInRange(0, 1) : false);
}

Planet.prototype = {
    constructor: Planet,
    hasPort: function() {
        for (var slot of this.slots) {
            if (slot instanceof Port) {
                return true;
            }
        }
        return false;
    }
}

function Mine(resource) {
    this.level = 1;
    this.speed = 1;
    this.resource = resource;
    this.capacity = 100;
    this.load = 0;
}

Mine.prototype = {
    constructor: Mine
}

function Empty() {
    this.level = 1;
}

Empty.prototype = {
    constructor: Empty
}

function Port(type) {
    this.level = 1
    this.capacity = 50;
    this.inventory = [];
}

Port.prototype = {
    constructor: Port
}

//Functions To Generate Data

function computeSlotAmount(radius) {
    if (radius < 20050) return 2;
    if (radius < 36700) return 3;
    if (radius < 53350) return 4;
    if (radius < 70000) return 5;
}

function generateResources(planet) {
    var res = [];
    res.push(Resource.CARBON);
    res.push(Resource.IRON);
    res.push(Resource.OXYGEN);

    /*var i = (planet.radius > 33000 ? 2 : 1);
    while (i > 0) {
        res.push(Resource.OXYGEN);
        i--;
    }*/


    return res;
}
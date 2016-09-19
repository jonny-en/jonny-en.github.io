var SolarSystem = function() {};


SolarSystem.prototype = {

    init: function() {
        this.param = {
            systemCenterY: game.world.centerY,
            left: game.world.centerX - 337,
            rightinset: game.world.centerX + 120,
            line1: game.world.height - 295,
            lineShift: 25,
            lineTab: 50,
            slotShift: 110,
            slotRight: game.world.centerX + 248,
            orbitFacX: 3.75,
            orbitFacY: 2.25,
            tabY: game.world.height - 231
        }


        this.activeSystem = data.solarSystems[0];
        var style = fontStyles.small_white;

        this.dataHead = game.make.text(20, 20, "SOLAR SYSTEM DATA", style);
        this.dataName = game.make.text(20, 40, "NAME: " + this.activeSystem.name, style);
        this.dataPlanets = game.make.text(20, 55, "PLANETS: " + this.activeSystem.planets.length, style);

        this.playerHead = game.make.text(game.world.width - 30, 20, "PLAYER DATA", style);
        this.playerHead.anchor.set(1, 0);
        this.playerName = game.make.text(game.world.width - 30, 40, "NAME: " + data.player.name, style);
        this.playerName.anchor.set(1, 0);

        this.playerUc = game.make.text(game.world.width - 30, 55, "COINS: " + data.player.uc, style);
        this.playerUc.anchor.set(1, 0);
    },

    create: function() {
        //Time Events
        game.time.events.loop(Phaser.Timer.SECOND, this.updateMines, this);

        //Background
        this.bg = game.add.sprite(game.world.centerX, this.param.systemCenterY, 'background');
        this.bg.anchor.set(0.5);
        this.bg.scale.set(1);

        //Orbits
        this.orbits = game.add.graphics(0, 0);
        this.orbits.lineStyle(1, 0x444444);
        for (var planet of this.activeSystem.planets) {
            var width = this.param.orbitFacX * planet.distance;
            var height = this.param.orbitFacY * planet.distance;
            this.orbits.drawEllipse(game.world.centerX, this.param.systemCenterY, width, height);
        }

        //Data
        game.add.existing(this.dataHead);
        game.add.existing(this.dataName);
        game.add.existing(this.dataPlanets);
        game.add.existing(this.playerHead);
        game.add.existing(this.playerName);
        game.add.existing(this.playerUc);

        //Sun
        this.sun = game.add.sprite(game.world.centerX, this.param.systemCenterY, 'sun');
        this.sun.anchor.set(0.5);
        this.sun.scale.set(1);

        //Planets
        this.planets = game.add.group();
        for (var planet of this.activeSystem.planets) {
            var sprite = this.planets.create(game.world.centerX, game.world.centerY, 'planet' + planet.planetnr);
            sprite.anchor.set(0.5);
            sprite.scale.set((planet.radius) / 250000);
        }

        //Planet Labels
        var id = 0;
        this.planetLabels = game.add.group();
        for (var planet of this.activeSystem.planets) {
            var style = planet.discovered ? fontStyles.small_digital : fontStyles.small_white;
            var planetLabel = game.add.text(0, 0, planet.name, style, this.planetLabels);
            planetLabel.id = id++;
            planetLabel.inputEnabled = true;
            planetLabel.events.onInputDown.add(this.showOvl, this);
        }
    },

    //RENDER FUNCTION
    render: function() {
        var theta = 200 + (game.time.totalElapsedSeconds() / 3);

        //Rotate Planets   
        var id = 0;
        for (var planet of this.planets.children) {
            var speed = this.activeSystem.planets[id].speed;
            var distance = this.activeSystem.planets[id].distance;
            planet.x = game.world.centerX + this.param.orbitFacX * Math.cos(speed * theta) * distance;
            planet.y = this.param.systemCenterY + this.param.orbitFacY * Math.sin(speed * theta) * distance;
            this.planetLabels.children[id].x = planet.x + 10;
            this.planetLabels.children[id++].y = planet.y + 10;
        }
    },


    //UPDATE FUNCTIONS
    update: function() {
        //Resource Tab View  
        if (this.checkDefined([this.resourcesUpdateTexts])) {
            for (var text of this.resourcesUpdateTexts.children) {
                var load = parseInt(this.computeLoad(text.resource)) + "/" + this.computeCapacity(text.resource);
                text.setText(load);
            }
        }

        //Build Menu Costs
        if (this.checkDefined([this.buildMenuCostsTexts, this.buildMenuCostsOpt])) {
            for (var text of this.buildMenuCostsTexts.children) {
                var load = parseInt(this.computeLoad(text.resource));
                text.setText(load + "/" + text.cost);
            }
            var opt = this.buildMenuCostsOpt.children[0]
            if (this.checkDefined([opt]) && this.isPayable(opt.costs)) {
                if (!(opt.type === 'Port' && this.activePlanet.hasPort())) {
                    opt.loadTexture('slot_accept');
                }
            }
        }

        //Mine Menu Costs
        if (this.checkDefined([this.mineMenuCostsTexts, this.mineMenuCostsOpt])) {
            for (var text of this.mineMenuCostsTexts.children) {
                var load = parseInt(this.computeLoad(text.resource));
                text.setText(load + "/" + text.cost);
            }
            var opt = this.mineMenuCostsOpt.children[0]
            if (this.checkDefined([opt]) && this.isPayable(opt.costs)) {
                opt.loadTexture('slot_accept');
            }
        }

        //MineDetail
        if (this.slotMenuDetailLevel != undefined && this.clickedSlot != undefined) {
            var load = parseInt(this.activePlanet.slots[this.clickedSlot].load);
            var capacity = this.activePlanet.slots[this.clickedSlot].capacity;
            this.slotMenuDetailLevel.setText("LOAD: \t" + load + "/" + capacity);
        }
    },

    //Gets called once in a sec
    updateMines: function() {
        "use strict";

        for (var system of data.solarSystems) {
            for (var planet of system.planets) {
                for (var slot of planet.slots) {
                    if (slot instanceof Mine) {
                        var amount = 1 / Resource.parameters[slot.resource].duration;
                        var load = slot.load;
                        var capacity = slot.capacity;
                        if (load + amount <= capacity) {
                            slot.load = load + amount;
                        }
                    }
                }
            }
        }
    },

    //Menu Starts Here
    showOvl: function(sprite) {
        //Disable Input for Planets
        for (var i = 0; i < this.planetLabels.children.length; i++) {
            this.planetLabels.children[i].inputEnabled = false;
        }

        //Create Ovl Group
        this.activePlanet = this.activeSystem.planets[sprite.id];
        this.ovl = game.add.group();

        //Background
        this.ovlBackground = this.ovl.create(game.world.centerX, game.world.height - 40, 'overlay');
        this.ovlBackground.scale.set(1.25);
        this.ovlBackground.anchor.set(0.5, 1);

        //Headline
        var discovered = (this.activePlanet.discovered ? "discovered" : "undiscovered")
        this.ovlHead = game.add.text(this.param.left, game.world.height - 350, "PLANET DATA (" + discovered + ")", fontStyles.medium_black, this.ovl);

        this.ovlClose = game.add.text(game.world.centerX + 337, game.world.height - 350, "X", fontStyles.medium_black, this.ovl);
        this.ovlClose.anchor.set(1, 0);
        this.ovlClose.inputEnabled = true;
        this.ovlClose.events.onInputDown.add(this.hideOvl, this);

        //Details
        this.lines = game.add.group(this.ovl);
        this.line1 = game.add.text(this.param.left, this.param.line1, "NAME: " + this.activePlanet.name, fontStyles.medium_black, this.lines);
        this.line1.tabs = this.param.lineTab;

        this.line2 = game.add.text(this.param.left, this.param.line1 + this.param.lineShift, "RADIUS: " + this.activePlanet.radius + "km", fontStyles.medium_black, this.lines);
        this.line2.tabs = this.param.lineTab;

        this.line3 = game.add.text(this.param.left, this.param.line1 + 2 * this.param.lineShift, "", fontStyles.medium_black, this.lines);
        this.line3.tabs = this.param.lineTab;

        this.line4 = game.add.text(this.param.left, this.param.line1 + 3 * this.param.lineShift, "", fontStyles.medium_black, this.lines);
        this.line4.tabs = this.param.lineTab;

        //Check if Planet is discovered yet
        if (this.activePlanet.discovered === true) {
            //Menu
            this.menu = game.add.group(this.ovl);

            //Slots (Tab1 Content)
            this.showSlots();

            //Resources (Tab2 Content)
            this.showResources();

            //Menu Tabs
            this.tabBool = 1;
            this.switchMenuTabs();
        } else {
            this.line4.setText("This planet is undiscovered!");
        }
    },

    hideOvl: function() {
        this.ovl.removeAll(true);
        this.clickedSlot = undefined;
        for (var i = 0; i < this.planetLabels.children.length; i++) {
            this.planetLabels.children[i].inputEnabled = true;
        }
    },

    showSlots: function() {
        var sprites = {
            'Empty': 'slot_default',
            'Port': 'slot_port'
        };
        var slotHeight = game.world.height - 155;
        if (this.slots != undefined) {
            this.slots.removeAll(true);
        }
        this.slots = game.add.group(this.menu);

        for (var i = 0; i < this.activePlanet.slots.length; i++) {
            if (this.activePlanet.slots[i].constructor.name === 'Mine') {
                var slot = this.makeResourceSlot(this.param.left + (i * this.param.slotShift), slotHeight, this.activePlanet.slots[i].resource, this.slots);
            } else {
                var slot = this.slots.create(this.param.left + (i * this.param.slotShift), slotHeight, sprites[this.activePlanet.slots[i].constructor.name]);
            }
            slot.id = i;
            slot.scale.set(0.9);
            slot.inputEnabled = true;
            slot.events.onInputDown.add(this.openSlotMenu, this);
        }
    },

    showResources: function() {
        var textHeight = game.world.height - 155;

        if (this.resources != undefined) {
            this.resources.removeAll(true);
        }
        this.resources = game.add.group(this.menu);
        this.resourcesUpdateTexts = game.add.group(this.resources);

        for (var i = 0; i < this.activePlanet.resources.length; i++) {
            var resource = game.add.text(this.param.left, textHeight + (i * 25), this.activePlanet.resources[i], fontStyles.medium_black, this.resources);
            var value = game.add.text(game.world.centerX + 337, textHeight + (i * 25), "undef", fontStyles.medium_black, this.resourcesUpdateTexts);
            value.anchor.set(1, 0);
            value.resource = this.activePlanet.resources[i];
        }
    },

    computeCapacity: function(resource) {
        var cap = 0;
        for (var i = 0; i < this.activePlanet.slots.length; i++) {
            if (this.activePlanet.slots[i] instanceof Mine) {
                if (this.activePlanet.slots[i].resource === resource) {
                    cap += this.activePlanet.slots[i].capacity;
                }
            }
        }
        return cap;
    },

    computeLoad: function(resource) {
        if (resource === Resource.COIN) {
            return data.player.uc;
        }
        var load = 0;
        for (var i = 0; i < this.activePlanet.slots.length; i++) {
            if (this.activePlanet.slots[i] instanceof Mine) {
                if (this.activePlanet.slots[i].resource === resource) {
                    load += this.activePlanet.slots[i].load;
                }
            }
        }
        return load;
    },

    switchMenuTabs: function() {
        this.tabBool = !this.tabBool;

        var texts = [
            "SLOTS(" + this.activePlanet.slots.length + ")",
            "RESOURCES(" + this.activePlanet.resources.length + ")"
        ];
        if (this.tabBool) {
            this.slots.removeAll(true);
            this.resources.visible = true;

            this.menuTab1 = this.makeTab(this.param.left, this.param.tabY, texts[0], 0x7e8b99, fontStyles.medium_black, this.switchMenuTabs, this.menu);
            this.menuTab2 = this.makeTab(game.world.centerX + 10, this.param.tabY, texts[1], 0x000000, fontStyles.medium_digital, this.switchMenuTabs, this.menu);

        } else {
            this.showSlots();
            this.resources.visible = false;

            this.menuTab1 = this.makeTab(this.param.left, this.param.tabY, texts[0], 0x000000, fontStyles.medium_digital, this.switchMenuTabs, this.menu);
            this.menuTab2 = this.makeTab(game.world.centerX + 10, this.param.tabY, texts[1], 0x7e8b99, fontStyles.medium_black, this.switchMenuTabs, this.menu);
        }
    },

    /**
     * SLOT MENU starts here:
     * This function gets called when a Slot is clicked.
     */
    openSlotMenu: function(sprite) {

        //Functions for different Slots
        var slotMenuFunc = {
            Empty: function(context) { context.openEmpty() },
            Mine: function(context) { context.openMine() },
            Port: function(context) { context.openPort() }
        };

        //Group Change
        this.clearLines();
        this.slotMenu = game.add.group(this.ovl);
        this.menu.visible = false;

        //Save clicked Slot
        this.clickedSlot = (this.clickedSlot === undefined ? sprite.id : ((sprite != undefined && sprite.id != undefined) ? sprite.id : this.clickedSlot));

        //Set Head Text
        this.ovlHead.setText("SLOT DATA (" + this.activePlanet.slots[this.clickedSlot].constructor.name + ")");

        //Call special Function for different Slots
        slotMenuFunc[this.activePlanet.slots[this.clickedSlot].constructor.name](this);
    },

    closeSlotMenu: function() {
        this.slotMenu.removeAll(true);
        this.menu.visible = true;
        this.resetLines();
    },

    /**
     * Different Slot Details start here:
     * Group for the shown Details is context.slotMenu! 
     */

    //Empty Detail (BUILD OR MINE?)
    openEmpty: function() {
        this.line3.setText("What do you want to do?");

        //Options
        this.slotMenu.options = [{
            sprite: 'slot_mine',
            func: this.openMineMenu,
            text: 'Mine'
        }, {
            sprite: 'slot_build',
            func: this.openBuildMenu,
            text: 'Build'
        }, {
            sprite: 'slot_back',
            func: this.closeSlotMenu,
            text: 'Back'
        }];
        this.makeOptions(this.slotMenu.options, this.slotMenu);
    },

    //Mine Detail
    openMine: function() {
        //Texts
        var speed = new String(this.activePlanet.slots[this.clickedSlot].speed / Resource.parameters[this.activePlanet.slots[this.clickedSlot].resource].duration);
        var texts = [
            "TYPE: \t" + this.activePlanet.slots[this.clickedSlot].resource,
            "LEVEL:\t" + this.activePlanet.slots[this.clickedSlot].level,
            "SPEED:\t" + speed.substring(0, 3) + "/s"
        ]
        this.setLines(texts);
        this.slotMenuDetailLevel = game.add.text(this.param.left, game.world.height - 225, "undef", fontStyles.medium_black, this.slotMenu);
        this.slotMenuDetailLevel.tabs = 50;

        //Preview
        this.slotMenuPreview = this.makeResourceSlot(this.param.slotRight, this.param.line1, this.activePlanet.slots[this.clickedSlot].resource, this.slotMenu);
        this.slotMenuPreview.scale.set(0.9);

        //Options
        this.slotMenu.options = [{
            sprite: 'slot_delete',
            func: this.deleteMine,
            text: 'Del.'
        }, {
            sprite: 'slot_back',
            func: this.closeSlotMenu,
            text: 'Back'
        }];
        this.makeOptions(this.slotMenu.options, this.slotMenu);
    },

    openPort: function() {
        //Options
        this.slotMenu.options = [{
            sprite: 'slot_back',
            func: this.closeSlotMenu,
            text: 'Back'
        }];
        this.makeOptions(this.slotMenu.options, this.slotMenu);
    },

    /**
     * MINE and BUILD MENU!
     * Stuff that is shown, when Slot ist Empty
     */

    openMineMenu: function() {
        if (this.slotMenu.children != undefined) {
            this.slotMenu.removeAll(true);
        }
        this.mineMenu = game.add.group(this.ovl);
        this.mineMenu.destroyChildren = true;
        this.line3.setText("What do you want to mine?");

        this.mineMenu.options = [];
        //Resources
        for (var i = 0; i < this.activePlanet.resources.length; i++) {
            if (this.activePlanet.resources[i].length > 4) {
                var shortLongform = this.activePlanet.resources[i].substring(0, 4) + ".";
            } else {
                var shortLongform = this.activePlanet.resources[i];
            }

            this.mineMenu.options.push({ sprite: 'resource', func: this.openMineMenuCosts, text: shortLongform, resource: this.activePlanet.resources[i] })
        }

        this.mineMenu.options.push({ sprite: 'slot_back', func: this.closeMineMenu, text: 'Back' });
        this.makeOptions(this.mineMenu.options, this.mineMenu);
    },

    closeMineMenu: function() {
        this.clearLines();
        this.mineMenu.removeAll(true);
        this.openSlotMenu();
    },

    openMineMenuCosts: function(sprite) {

        //Generate Variables
        var level = this.activePlanet.slots[this.clickedSlot].level;
        var resource = sprite.resource;
        var resourceShort = Resource.parameters[resource].shortform;
        var rString = new String(resource).toUpperCase();

        var costString = resourceShort + "_" + level;
        var costs = Prices[costString];
        if (costs === undefined) {
            costs = Prices['def'];
        }

        //Group Change
        this.mineMenu.removeAll(true);
        this.mineMenuCosts = game.add.group(this.ovl);

        //Slot Preview
        this.buildSlot = this.makeResourceSlot(this.param.slotRight, this.param.line1, resource, this.mineMenuCosts);

        this.clearLines();

        //Options
        this.mineMenuCosts.options = [{
            sprite: 'slot_accept_dis',
            func: this.buildMine,
            text: 'Build'
        }, {
            sprite: 'slot_back',
            func: this.closeMineMenuCosts,
            text: 'Back'
        }];

        this.mineMenuCostsOpt = this.makeOptions(this.mineMenuCosts.options, this.mineMenuCosts);
        //Pass needed variables to Build Button
        this.mineMenuCostsOpt.children[0].costs = costs;
        this.mineMenuCostsOpt.children[0].resource = resource;


        //Text (Costs)
        this.mineMenuCostsTexts = game.add.group(this.mineMenuCosts);
        this.line1.setText("BUILD " + rString + " MINE (LVL " + level + ")");
        this.displayCosts(costs, this.mineMenuCostsTexts);
    },

    closeMineMenuCosts: function() {
        this.clearLines();
        this.mineMenuCosts.removeAll(true);
        this.openMineMenu();
    },

    buildMine: function(sprite) {

        if (this.isPayable(sprite.costs)) {
            for (var i = 0; i < sprite.costs.length - 1; i += 2) {
                if (i === 0) {
                    data.player.uc -= sprite.costs[i + 1];
                    this.playerUc.setText("COINS: " + data.player.uc);
                } else {
                    this.decreaseResource(sprite.costs[i], sprite.costs[i + 1]);
                }
                this.activePlanet.slots[this.clickedSlot] = new Mine(sprite.resource);
                this.mineMenuCosts.removeAll(true);
                this.menu.visible = true;
                this.resetLines();
                this.showSlots();
            }
        }
    },

    deleteMine: function(sprite) {
        this.activePlanet.slots[this.clickedSlot] = new Empty();
        this.slotMenu.removeAll(true);
        this.showSlots();
        this.menu.visible = true;
        this.resetLines();
    },

    //BUILD MENU
    openBuildMenu: function() {
        this.clearLines();
        this.line3.setText("What do you want to build?");

        if (this.slotMenu.children != undefined) {
            this.slotMenu.removeAll(true);
        }
        this.buildMenu = game.add.group(this.ovl);
        this.buildMenu.options = [{
            sprite: 'slot_port',
            func: this.openBuildMenuCosts,
            text: 'Port'
        }, {
            sprite: 'slot_back',
            func: this.closeBuildMenu,
            text: 'Back'
        }];

        this.buildMenuOpt = this.makeOptions(this.buildMenu.options, this.buildMenu);
    },

    closeBuildMenu: function() {
        this.buildMenu.removeAll(true);
        this.openSlotMenu();
    },

    openBuildMenuCosts: function(sprite) {
        var level = this.activePlanet.slots[this.clickedSlot].level;
        var costs = Prices[sprite.type + "_" + level];

        //Group Change
        this.buildMenu.removeAll(true);
        this.buildMenuCosts = game.add.group(this.ovl);

        //Slot Preview
        this.buildMenuCostsPreview = this.buildMenuCosts.create(this.param.slotRight, this.param.line1, sprite.key);
        this.buildMenuCostsPreview.scale.set(0.9);

        //Options
        this.buildMenuCosts.options = [{
            sprite: 'slot_accept_dis',
            func: this.build,
            text: 'Build'
        }, {
            sprite: 'slot_back',
            func: this.closeBuildMenuCosts,
            text: 'Back'
        }];
        this.buildMenuCostsOpt = this.makeOptions(this.buildMenuCosts.options, this.buildMenuCosts);
        this.buildMenuCostsOpt.children[0].type = sprite.type;
        this.buildMenuCostsOpt.children[0].costs = costs;

        //Costs
        this.buildMenuCostsTexts = game.add.group(this.buildMenuCosts);
        if (this.activePlanet.hasPort() && sprite.type === 'Port') {
            this.line1.setText("YOU CAN ONLY BUILD ONE PORT!");
            this.displayCosts(costs, this.buildMenuCostsTexts);
        } else {
            this.line1.setText("BUILD " + sprite.type.toUpperCase() + " (LVL " + level + ")");
            this.displayCosts(costs, this.buildMenuCostsTexts);
        }
    },

    closeBuildMenuCosts: function() {
        this.buildMenuCosts.removeAll(true);
        this.openBuildMenu();
    },

    build: function(sprite) {
        if (this.activePlanet.hasPort() && sprite.type === 'Port') {
            return;
        }

        if (this.isPayable(sprite.costs)) {

            this.payCosts(sprite.costs);

            var build = {
                Port: function(context) {
                    context.activePlanet.slots[context.clickedSlot] = new Port();
                    context.activePlanet.slots.push(new Empty());
                }
            };

            build[sprite.type](this);

            this.buildMenuCosts.removeAll(true);
            this.menu.visible = true;
            this.showSlots();
            this.resetLines();

        }
    },


    //UTILS
    //Should only be called if decrease is possible
    decreaseResource: function(resource, amount) {
        var i = 0;
        while (amount > 0 && i < this.activePlanet.slots.length) {
            if (this.activePlanet.slots[i] instanceof Mine) {
                if (this.activePlanet.slots[i].resource === resource) {
                    var load = this.activePlanet.slots[i].load;
                    if (load - amount >= 0) {
                        this.activePlanet.slots[i].load -= amount;
                        amount = 0;
                    } else {
                        amount -= load;
                        this.activePlanet.slots[i].load = 0;
                        i++;
                    }
                } else {
                    i++;
                }
            } else {
                i++;
            }
        }
    },


    resetLines: function() {
        this.ovlHead.setText("PLANET DATA (" + (this.activePlanet.discovered ? "discovered" : "undiscovered") + ")");
        this.line1.setText("NAME: " + this.activePlanet.name);
        this.line2.setText("RADIUS: " + this.activePlanet.radius + "km");
        this.line3.setText(" ");
    },

    clearLines: function() {
        for (var line of this.lines.children) {
            line.setText("");
        }
    },

    setLines: function(texts) {
        for (var i = 0; i < this.lines.children.length; i++) {
            if (texts[i] === undefined) {
                texts.push(" ");
            }
            this.lines.children[i].setText(texts[i])
        }
    },

    displayCosts: function(costs, group) {
        for (var i = 1; i < this.lines.children.length; i++) {
            if (costs[2 * (i - 1)] != undefined) {
                this.lines.children[i].setText(new String(costs[2 * (i - 1)]));
                var text = game.add.text(this.param.rightinset, this.param.line1 + 25 + (i - 1) * 25, "0/0", fontStyles.medium_black, group);
                text.anchor.set(1, 0);
                text.resource = costs[2 * (i - 1)];
                text.cost = costs[2 * i - 1];
            }
        }
    },

    isPayable: function(costs) {
        var isPayable = true;
        for (var i = 0; i < costs.length; i += 2) {
            if (this.computeLoad(costs[i]) - costs[i + 1] < 0) {
                isPayable = false;
            }
        }
        return isPayable;
    },

    payCosts: function(costs) {
        for (var i = 0; i < costs.length; i += 2) {
            if (i === 0) {
                data.player.uc -= costs[1];
                this.playerUc.setText("COINS: " + data.player.uc);
            } else {
                this.decreaseResource(costs[i], costs[i + 1]);
            }
        }
    },

    checkDefined: function(objects) {
        for (var object of objects) {
            if (object === undefined)
                return false;
        }
        return true;
    },

    //DRAWING UTILS
    makeResourceSlot: function(x, y, type, group) {

        var resource = group.create(x, y, 'slot_res');
        resource.scale.set(0.9);
        resource.resource = type;

        var shortFormText = Resource.parameters[type].shortform;

        if (shortFormText.length > 1) {
            resource.shortForm1 = game.add.text(x + 20, y + 20, shortFormText[0], fontStyles.slot_black, group);
            resource.shortForm2 = game.add.text(x + 55, y + 45, shortFormText[1], fontStyles.big_black, group);
        } else {
            resource.shortForm1 = game.add.text(x + 22, y + 20, shortFormText, fontStyles.slot_black, group);
        }
        return resource;
    },

    makeOptions: function(options, group) {
        var optGroup = game.add.group(group);
        for (var i = 0; i < options.length; i++) {
            if (options[i].sprite === 'resource') {
                option = this.makeResourceSlot(this.param.left + (i * this.param.slotShift), game.world.height - 165, options[i].resource, optGroup);
            } else {
                var option = optGroup.create(this.param.left + (i * this.param.slotShift), game.world.height - 165, options[i].sprite);
                option.scale.set(0.9);
                option.type = options[i].text;
            }
            option.inputEnabled = true;
            option.events.onInputDown.add(options[i].func, this);
            option.text = game.add.text(this.param.left + (i * this.param.slotShift), game.world.height - 70, options[i].text, fontStyles.medium_black, group);
        }
        return optGroup;
    },

    makeTab: function(x, y, text, color, fontStyle, func, group) {
        var tab = game.add.group(group);

        var tabBg = game.add.graphics(0, 0, tab);
        tabBg.beginFill(color);
        tabBg.drawRect(x, y, 325, 50);
        tabBg.endFill();
        tabBg.inputEnabled = true;
        tabBg.events.onInputDown.add(func, this);

        var tabText = game.add.text(x + 162, y + 27, text, fontStyle, tab);
        tabText.anchor.set(0.5);

        return tab;
    }
};
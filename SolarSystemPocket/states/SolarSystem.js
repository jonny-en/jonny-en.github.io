var SolarSystem = function() {};


SolarSystem.prototype = {

    init: function() {
        this.param = {
            left: game.world.centerX - 337,
            rightinset: game.world.centerX + 120,
            line1: game.world.height - 270,
            slotShift: 110
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
        this.bg = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
        this.bg.anchor.set(0.5);
        this.bg.scale.set(1);

        //Orbits
        this.orbits = game.add.graphics(0, 0);
        this.orbits.lineStyle(1, 0x444444);
        for (var i = 0; i < this.activeSystem.planets.length; i++) {
            this.orbits.drawEllipse(game.world.centerX, game.world.centerY, 3.5 * this.activeSystem.planets[i].distance, this.activeSystem.planets[i].distance * 2);
        }

        //Data
        game.add.existing(this.dataHead);
        game.add.existing(this.dataName);
        game.add.existing(this.dataPlanets);
        game.add.existing(this.playerHead);
        game.add.existing(this.playerName);
        game.add.existing(this.playerUc);

        //Sun
        this.sun = game.add.sprite(game.world.centerX, game.world.centerY, 'sun');
        this.sun.anchor.set(0.5);
        this.sun.scale.set(1);

        //Planets
        this.planets = game.add.group();
        for (var i = 0; i < this.activeSystem.planets.length; i++) {
            planet = this.planets.create(game.world.centerX, game.world.centerY, 'planet' + this.activeSystem.planets[i].planetnr);
            planet.anchor.set(0.5);
            planet.scale.set((this.activeSystem.planets[i].radius) / 250000);
        }

        //Planet Labels
        this.planetLabels = game.add.group();
        for (var i = 0; i < this.activeSystem.planets.length; i++) {
            var style = this.activeSystem.planets[i].discovered ? fontStyles.small_digital : fontStyles.small_white;
            var planetLabel = game.add.text(0, 0, this.activeSystem.planets[i].name, style, this.planetLabels);
            planetLabel.id = i;
            planetLabel.inputEnabled = true;
            planetLabel.events.onInputDown.add(this.showPlanetDetail, this);
        }
    },

    render: function() {
        theta = game.time.totalElapsedSeconds() * 2;

        //Rotate Planets   
        for (var i = 0; i < this.planets.children.length; i++) {
            this.planets.children[i].x = game.world.centerX + 1.75 * Math.cos(this.activeSystem.planets[i].speed * theta) * this.activeSystem.planets[i].distance * 2;
            this.planets.children[i].y = game.world.centerY + Math.sin(this.activeSystem.planets[i].speed * theta) * this.activeSystem.planets[i].distance * 2;
            if (this.activeSystem.planets.length === this.planetLabels.children.length) {
                this.planetLabels.children[i].x = this.planets.children[i].x + 10;
                this.planetLabels.children[i].y = this.planets.children[i].y + 10;
            }
        }
    },

    update: function() {
        //Resource Tab View  
        if (this.resourcesUpdateTexts != undefined) {
            for (var i = 0; i < this.resourcesUpdateTexts.children.length; i++) {
                this.resourcesUpdateTexts.children[i].setText(parseInt(this.computeLoad(this.activePlanet.resources[i])) + "/" + this.computeCapacity(this.activePlanet.resources[i]));
            }
        }

        //Build Menu Costs
        if (this.buildMenuCostsTexts != undefined) {
            for (var i = 0; i < this.buildMenuCostsTexts.children.length; i++) {
                var resource = this.buildMenuCostsTexts.children[i].resource;
                var cost = this.buildMenuCostsTexts.children[i].cost;
                var load = this.computeLoad(resource);
                this.buildMenuCostsTexts.children[i].setText(load + "/" + cost);
            }
        }

        //Mine Menu Costs
        if (this.mineMenuCostsTexts != undefined && this.mineMenuCostsOpt != undefined && this.mineMenuCostsOpt.children[0] != undefined) {
            for (var i = 0; i < this.mineMenuCostsTexts.children.length; i++) {
                this.mineMenuCostsTexts.children[i].setText(parseInt(this.computeLoad(this.mineMenuCostsTexts.children[i].resource)) + "/" + this.mineMenuCostsTexts.children[i].price);
            }
            if (this.isPayable(this.mineMenuCostsOpt.children[0].costs)) {
                this.mineMenuCostsOpt.children[0].loadTexture('slot_accept');
            }
        }

        //Mine Detail
        if (this.slotMenuDetailLevel != undefined && this.clickedSlot != undefined) {
            this.slotMenuDetailLevel.setText("LOAD: \t" + parseInt(this.activePlanet.slots[this.clickedSlot].load) + "/" + this.activePlanet.slots[this.clickedSlot].capacity);
        }
    },

    updateMines: function() {
        for (var i = 0; i < data.solarSystems.length; i++) {
            for (var j = 0; j < data.solarSystems[i].planets.length; j++) {
                for (var k = 0; k < data.solarSystems[i].planets[j].slots.length; k++) {
                    if (data.solarSystems[i].planets[j].slots[k] instanceof Mine) {
                        var possibleResult = data.solarSystems[i].planets[j].slots[k].load + 1 / Resource.parameters[data.solarSystems[i].planets[j].slots[k].resource].duration;
                        if (possibleResult <= data.solarSystems[i].planets[j].slots[k].capacity) {
                            data.solarSystems[i].planets[j].slots[k].load = possibleResult;
                        }
                    }
                }
            }
        }
    },

    showPlanetDetail: function(sprite) {
        for (var i = 0; i < this.planetLabels.children.length; i++) {
            this.planetLabels.children[i].inputEnabled = false;
        }

        this.activePlanet = this.activeSystem.planets[sprite.id];
        this.planetDetail = game.add.group();

        //Background
        this.planetDetailBackground = this.planetDetail.create(game.world.centerX, game.world.height - 40, 'overlay');
        this.planetDetailBackground.scale.set(1.25);
        this.planetDetailBackground.anchor.set(0.5, 1);

        //Headline
        this.planetDetailHead = game.add.text(this.param.left, game.world.height - 350, "PLANET DATA (" + (this.activePlanet.discovered ? "discovered" : "undiscovered") + ")", fontStyles.medium_black, this.planetDetail);

        this.planetDetailClose = game.add.text(game.world.centerX + 337, game.world.height - 350, "X", fontStyles.medium_black, this.planetDetail);
        this.planetDetailClose.anchor.set(1, 0);
        this.planetDetailClose.inputEnabled = true;
        this.planetDetailClose.events.onInputDown.add(this.hidePlanetDetail, this);

        //Details
        this.lines = game.add.group(this.planetDetail);
        this.line1 = game.add.text(this.param.left, game.world.height - 300, "NAME: " + this.activePlanet.name, fontStyles.medium_black, this.lines);
        this.line1.tabs = 50;

        this.line2 = game.add.text(this.param.left, game.world.height - 275, "RADIUS: " + this.activePlanet.radius + "km", fontStyles.medium_black, this.lines);
        this.line2.tabs = 50;

        this.line3 = game.add.text(this.param.left, game.world.height - 250, "", fontStyles.medium_black, this.lines);
        this.line3.tabs = 50;

        this.line4 = game.add.text(this.param.left, game.world.height - 225, "", fontStyles.medium_black, this.lines);
        this.line4.tabs = 50;

        if (this.activePlanet.discovered === true) {
            //Menu
            this.menu = game.add.group(this.planetDetail);

            //Slots (Tab1 Content)
            this.showSlots();

            //Resources (Tab2 Content)
            this.showResources();

            //Menu Tabs
            this.tabBool = 1;
            this.switchMenuTabs();
        } else {
            this.planetNoDetail = game.add.text(this.param.left, game.world.height - 150, "This planet is undiscovered!", fontStyles.medium_black, this.planetDetail);
        }
    },

    hidePlanetDetail: function() {
        this.planetDetail.removeAll(true);
        this.clickedSlot = undefined;
        for (var i = 0; i < this.planetLabels.children.length; i++) {
            this.planetLabels.children[i].inputEnabled = true;
        }
    },

    showSlots: function() {
        if (this.slots != undefined) {
            this.slots.removeAll(true);
        }
        this.slots = game.add.group(this.menu);

        for (var i = 0; i < this.activePlanet.slots.length; i++) {
            switch (this.activePlanet.slots[i].constructor.name) {
                case 'Mine':
                    var slot = this.makeResourceSlot(this.param.left + (i * this.param.slotShift), game.world.height - 155, this.activePlanet.slots[i].resource, this.slots);
                    break;
                case 'Empty':
                    var slot = this.slots.create(this.param.left + (i * this.param.slotShift), game.world.height - 155, 'slot_default');
                    break;
                case 'Port':
                    var slot = this.slots.create(this.param.left + (i * this.param.slotShift), game.world.height - 155, 'slot_port');
                    break;
                default:
                    var slot = this.slots.create(this.param.left + (i * this.param.slotShift), game.world.height - 155, 'slot_default');
                    break;
            }
            slot.id = i;
            slot.scale.set(0.9);
            slot.inputEnabled = true;
            slot.events.onInputDown.add(this.openSlotMenu, this);
        }
    },

    showResources: function() {
        if (this.resources != undefined) {
            this.resources.removeAll(true);
        }
        this.resources = game.add.group(this.menu);
        this.resourcesUpdateTexts = game.add.group(this.resources);

        for (var i = 0; i < this.activePlanet.resources.length; i++) {
            var resource = game.add.text(this.param.left, game.world.height - 155 + (i * 25), this.activePlanet.resources[i], fontStyles.medium_black, this.resources);

            var value = game.add.text(game.world.centerX + 337, game.world.height - 155 + (i * 25), this.computeLoad(this.activePlanet.resources[i]) + "/" + this.computeCapacity(this.activePlanet.resources[i]), fontStyles.medium_black, this.resourcesUpdateTexts);
            value.anchor.set(1, 0);
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
        if (!this.tabBool) {
            this.slots.removeAll(true);
            this.resources.visible = true;

            this.menuTab1 = this.makeTab(this.param.left, game.world.height - 230, "SLOTS(" + this.activePlanet.slots.length + ")", 0xcdd478, fontStyles.medium_black, this.menu);
            this.menuTab1.children[0].inputEnabled = true;
            this.menuTab1.children[0].events.onInputDown.add(this.switchMenuTabs, this);

            this.menuTab2 = this.makeTab(game.world.centerX + 10, game.world.height - 230, "RESOURCES(" + this.activePlanet.resources.length + ")", 0x000000, fontStyles.medium_digital, this.menu);
            this.menuTab2.children[0].inputEnabled = true;
            this.menuTab2.children[0].events.onInputDown.add(this.switchMenuTabs, this);
        } else {
            this.showSlots();
            this.resources.visible = false;

            this.menuTab1 = this.makeTab(this.param.left, game.world.height - 230, "SLOTS(" + this.activePlanet.slots.length + ")", 0x000000, fontStyles.medium_digital, this.menu);
            this.menuTab1.children[0].inputEnabled = true;
            this.menuTab1.children[0].events.onInputDown.add(this.switchMenuTabs, this);

            this.menuTab2 = this.makeTab(game.world.centerX + 10, game.world.height - 230, "RESOURCES(" + this.activePlanet.resources.length + ")", 0xcdd478, fontStyles.medium_black, this.menu);
            this.menuTab2.children[0].inputEnabled = true;
            this.menuTab2.children[0].events.onInputDown.add(this.switchMenuTabs, this);
        }
        this.tabBool = !this.tabBool;
    },


    //SLOT MENU

    openSlotMenu: function(sprite) {
        if (this.clickedSlot === undefined) {
            this.clickedSlot = sprite.id;
        } else if (sprite != undefined) {
            this.clickedSlot = sprite.id;
        }
        this.slotMenu = game.add.group(this.planetDetail);
        this.planetDetailHead.setText("SLOT DATA (" + (this.activePlanet.slots[this.clickedSlot].name) + ")");

        this.menu.visible = false;

        switch (this.activePlanet.slots[this.clickedSlot].constructor.name) {

            case 'Empty':
                this.line1.setText("");
                this.line2.setText("");
                this.line3.setText("What do you want to do?");

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

                break;
            case 'Mine':
                this.planetDetailHead.setText("SLOT DATA (" + this.activePlanet.slots[this.clickedSlot].constructor.name + ")");
                this.line1.setText("TYPE: \t" + this.activePlanet.slots[this.clickedSlot].resource);
                this.line2.setText("LEVEL:\t" + this.activePlanet.slots[this.clickedSlot].level);
                var speed = "SPEED:\t" + new String(this.activePlanet.slots[this.clickedSlot].speed / Resource.parameters[this.activePlanet.slots[this.clickedSlot].resource].duration).substring(0, 3) + "/s";
                this.line3.setText(speed);

                this.slotMenuDetailLevel = game.add.text(this.param.left, game.world.height - 225, "LOAD:\t" + "/" + parseInt(this.activePlanet.slots[this.clickedSlot].capacity), fontStyles.medium_black, this.slotMenu);
                this.slotMenuDetailLevel.tabs = 50;

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
                break;
        }
    },

    closeSlotMenu: function() {
        this.slotMenu.removeAll(true);
        this.menu.visible = true;
        this.resetText();
    },

    //MINE MENU

    openMineMenu: function() {
        if (this.slotMenu.children != undefined) {
            this.slotMenu.removeAll(true);
        }
        this.mineMenu = game.add.group(this.planetDetail);
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
        this.mineMenu.removeAll(true);
        this.openSlotMenu();
    },

    openMineMenuCosts: function(sprite) {

        //Generate Variables
        var level = this.activePlanet.slots[this.clickedSlot].level;

        var costString = resourceShort + "_" + level;
        var costs = Prices[costString];
        if (costs === undefined) {
            costs = Prices['def'];
        }

        var resource = sprite.resource;
        var resourceShort = Resource.parameters[resource].shortform;
        var rString = new String(resource).toUpperCase();

        //Group Change
        this.mineMenu.removeAll(true);
        this.mineMenuCosts = game.add.group(this.planetDetail);

        //Slot Preview
        this.buildSlot = this.makeResourceSlot(game.world.centerX + 248, this.param.line1, resource, this.mineMenuCosts);

        this.line1.setText('\tCOSTS');
        this.line3.setText('');

        //Options
          this.mineMenuCosts.options = [{
            sprite: 'slot_accept',
            func: this.buildMine,
            text: 'Build'
        }, {
            sprite: 'slot_back',
            func: this.closeMineMenuCosts,
            text: 'Back'
        }];

        if (!this.isPayable(costs)) {
            this.mineMenuCosts.options[0].sprite = 'slot_accept_dis'
        }

        this.mineMenuCostsOpt = this.makeOptions(this.mineMenuCosts.options, this.mineMenuCosts);
        //Pass needed variables to Build Button
        this.mineMenuCostsOpt.children[0].costs = costs;
        this.mineMenuCostsOpt.children[0].resource = resource;


         //Costs
        this.mineMenuCostsTexts = game.add.group(this.buildMenuCosts);
        this.line1.setText("BUILD " + sprite.type.toUpperCase() + " (LVL " + level + ")");
        for (var i = 1; i < this.lines.children.length; i++) {
            if (costs[2 * (i - 1)] != undefined) {

                this.lines.children[i].setText(new String(costs[2 * (i - 1)]));

                var text = game.add.text(this.param.rightinset, this.param.line1 + (i - 1) * 25, "0/0", fontStyles.medium_black, this.mineMenuCostsTexts);
                text.anchor.set(1, 0);
                text.resource = costs[2 * (i - 1)];
                text.cost = costs[2 * i - 1];
            }
        }
/*

        this.mineMenuCostsTexts = game.add.group(this.mineMenuCosts);
        this.line1.setText("BUILD " + rString + " MINE (LVL " + level + ")");

        for (var i = 0; i < costs.length; i += 2) {
            var priceName = costs[i];
            var price = costs[i + 1];
            var name = game.add.text(game.world.centerX - 300, this.param.line1 + (i * 12.5), priceName + ":", fontStyles.medium_black, this.mineMenuCosts);
            var cost = game.add.text(this.param.rightinset, this.param.line1 + (i * 12.5), parseInt(this.computeLoad(priceName)) + "/" + price, fontStyles.medium_black, this.mineMenuCostsTexts);
            cost.price = price;
            cost.resource = priceName;
            cost.anchor.set(1, 0);
        }*/

      
    },

    closeMineMenuCosts: function() {
        this.line1.setText("");
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
                this.resetText();
                this.showSlots();
            }
        }
    },

    deleteMine: function(sprite) {
        this.activePlanet.slots[this.clickedSlot] = new Empty();
        this.slotMenu.removeAll(true);
        this.showSlots();
        this.menu.visible = true;
        this.resetText();
    },

    //BUILD MENU
    openBuildMenu: function() {
        this.line1.setText("");
        this.line2.setText("");
        this.line4.setText("");
        this.line3.setText("What do you want to build?");
        if (this.slotMenu.children != undefined) {
            this.slotMenu.removeAll(true);
        }
        this.buildMenu = game.add.group(this.planetDetail);
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
        this.buildMenuCosts = game.add.group(this.planetDetail);

        //Slot Preview
        this.buildMenuCostsPreview = this.buildMenuCosts.create(game.world.centerX + 248, this.param.line1, sprite.key);
        this.buildMenuCostsPreview.scale.set(0.9);

        //Options
        this.buildMenuCosts.options = [{
            sprite: 'slot_accept',
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
        this.line1.setText("BUILD " + sprite.type.toUpperCase() + " (LVL " + level + ")");
        for (var i = 1; i < this.lines.children.length; i++) {
            if (costs[2 * (i - 1)] != undefined) {

                this.lines.children[i].setText(new String(costs[2 * (i - 1)]));

                var text = game.add.text(this.param.rightinset, this.param.line1 + (i - 1) * 25, "0/0", fontStyles.medium_black, this.buildMenuCostsTexts);
                text.anchor.set(1, 0);
                text.resource = costs[2 * (i - 1)];
                text.cost = costs[2 * i - 1];
            }
        }
    },

    closeBuildMenuCosts: function() {
        this.buildMenuCosts.removeAll(true);
        this.openBuildMenu()
    },

    build: function(sprite) {
        if (this.isPayable(sprite.costs)) {

            this.payCosts(sprite.costs);

            switch (sprite.type) {
                case 'Port':
                    this.activePlanet.slots[this.clickedSlot] = new Port();
                    this.activePlanet.slots.push(new Empty());
                    break;
            }

            this.buildMenuCosts.removeAll(true);
            this.menu.visible = true;
            this.showSlots();
            this.resetText();

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


    resetText: function() {
        this.planetDetailHead.setText("PLANET DATA (" + (this.activePlanet.discovered ? "discovered" : "undiscovered") + ")");
        this.line1.setText("NAME: " + this.activePlanet.name);
        this.line2.setText("RADIUS: " + this.activePlanet.radius + "km");
        this.line3.setText(" ");
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

    makeTab: function(x, y, text, color, fontStyle, group) {
        var tab = game.add.group(group);

        var tabBg = game.add.graphics(0, 0, tab);
        tabBg.beginFill(color);
        tabBg.drawRect(x, y, 325, 50);
        tabBg.endFill();

        var tabText = game.add.text(x + 162, y + 27, text, fontStyle, tab);
        tabText.anchor.set(0.5);

        return tab;
    }
};

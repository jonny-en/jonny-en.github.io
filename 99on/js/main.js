'use strict';
var active_round = [-1,-1,-1];
var stored_rounds = []; 
var darts_round = 3;

$( "#view-stats" ).click(function() {

	var stats = []
	stats = JSON.parse(localStorage.getItem("sessions"));
	if(stats != null){
		stats.forEach(function(game, i){

			var total = 0;
			var hits = 0;

			game.forEach(function(r){
				r.forEach(function(d){
					total += d;

					if(d != 0){
						hits++;
					}
				});
			});
			var percentage = Math.round(100*hits/99)/100;
			$( "#ls-stats" ).append("<div class='row'><div class='col-3'><span>" + (i+1) + "</span></div><div class='col-3'><span>" + percentage +"</span></div><div class='col-3'><span>"+ total +"</span></div></div>");
		});
	}
	$( "#stats-view" ).fadeIn( "fast", function() {});
});

$( "#hide-stats" ).click(function() {
	$( "#stats-view" ).fadeOut( "fast", function() {
		$( "#ls-stats" ).text("");
	});
});

$( "#miss" ).click(function() {
	if(darts_round > 0){
		active_round[3-darts_round] = 0;
		darts_round--;
		updateGUI();
	}

});

$( "#single" ).click(function() {
	if(darts_round > 0){
		active_round[3-darts_round] = 1;
		darts_round--;
		updateGUI();
	}

});

$( "#double" ).click(function() {
	if(darts_round > 0){
		active_round[3-darts_round] = 2;
		darts_round--;
		updateGUI();
	}
});

$( "#triple" ).click(function() {	
	if(darts_round > 0){
		active_round[3-darts_round] = 3;
		darts_round--;
		updateGUI();
	}
});

$( "#undo" ).click(function() {	
	if(darts_round < 3){
	darts_round++;
	active_round[3-darts_round] = -1;
	updateGUI();
	}else if(stored_rounds.length > 0){ 
		active_round = stored_rounds[stored_rounds.length-1];
		stored_rounds.pop();
		darts_round = 0;
		updateGUI();
	}
});

$( "#next" ).click(function() {	
	if(darts_round == 0){
	stored_rounds.push(active_round);
	darts_round = 3;
	active_round =[-1,-1,-1];
	}
	if(stored_rounds.length == 33){
		if(localStorage.getItem("sessions") === null) {
			var a = [];
			a.push(stored_rounds);
			localStorage.setItem('sessions', JSON.stringify(a));
		}
		else{
			var a = [];
			a = JSON.parse(localStorage.getItem('sessions'));
			a.push(stored_rounds);
			localStorage.setItem('sessions', JSON.stringify(a));
		}
		stored_rounds = [];
	}
	updateGUI();
});

function updateGUI(){
	var temp_s = 0;
	var temp_d = 0;
	var temp_t = 0;
 	stored_rounds.forEach(function(r){
		r.forEach(function(d){
			switch(d){
				case 1:
					temp_s++;
					break;
				case 2:
					temp_d++;
					break;
				case 3:
					temp_t++;
					break;
			}
		})
	});
	active_round.forEach(function(d){
		switch(d){
			case 1:
				temp_s++;
				break;
			case 2:
				temp_d++;
				break;
			case 3:
				temp_t++;
				break;
		}
	});
	var thrown = stored_rounds.length*3 + 3 - darts_round;
	var hits = temp_s+temp_d+temp_t;
	$("#thrown").text("THROWN DARTS: " + thrown );
	var points = temp_s + temp_d*2 + temp_t*3;
	$("#pointsspan").text(points);
	$("#single-stats").text(temp_s);
	$("#double-stats").text(temp_d);
	$("#triple-stats").text(temp_t);
	if(darts_round < 3 || stored_rounds.length > 0){
	var percentage = Math.round(10000*hits/thrown)/100;
	$("#hits-stats").text(hits + "/" + thrown + " (" + percentage + "%)");
	}
	else{
	$("#hits-stats").text("HITS: 0/0");
	}
	if(active_round[0] == -1){
		$("#dart_1").text("➵");
	}
	else{
		$("#dart_1").text(active_round[0]);
	}
	if(active_round[1] == -1){
		$("#dart_2").text("➵");
	}
	else{
		$("#dart_2").text(active_round[1]);
	}
	if(active_round[2] == -1){
		$("#dart_3").text("➵");
	}
	else{
		$("#dart_3").text(active_round[2]);
	}
}




'use strict';


$(document).ready(function(){
	var active_round = [-1,-1,-1];
	var stored_rounds = []; 
	var darts_round = 3;
	var stats = []
	var page = 0;
	
	$( "#stats-down" ).click(function() {
		if(page+1 * 5 < stats.length){
			page++;
			$("#ls-stats").text("");
			viewUpdateStats();
		}
	});
	$( "#stats-up" ).click(function() {
		if(page > 0){
			page--;
			$("#ls-stats").text("");
			viewUpdateStats();
		}
	});
	
	$( "#view-stats" ).click(viewUpdateStats);

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
			var a = [];
			if(!(localStorage.getItem("sessions") === null)) {
				a = JSON.parse(localStorage.getItem('sessions'));
			}
			a.push(stored_rounds);
			localStorage.setItem('sessions', JSON.stringify(a));
			
			stored_rounds = [];
		}
		updateGUI();
	});

	function viewUpdateStats(){
		
		stats = JSON.parse(localStorage.getItem("sessions"));
		if(stats != null){
			var fdav = 0, sdav = 0, tdav = 0, adav = 0;
			var fdpav = 0, sdpav = 0, tdpav = 0, adpav = 0;

			stats.forEach(function(game, i){
				if(i < page*5+5 && i >= page*5 ){
					var total = 0;
					var hits = 0;

					game.forEach(function(r){
						r.forEach(function(d, j){
							if(d != 0){
								total += d;
								adpav+=d;
								hits++;
								adav++;
								if(j == 0){
								  	fdav++;
								  	fdpav += d;
								}
								if(j == 1){
									sdav++;
								  	sdpav += d;
								}
								if(j == 2){
									tdav++;
									tdpav += d;
								}
							}
						});
					});
					var percentage = Math.round(1000*hits/99)/10;
					$( "#ls-stats" ).append("<div class='row'><div class='col-4'><span>" + (i+1) + "</span></div><div class='col-4'><span>" + percentage +"</span></div><div class='col-4'><span>"+ total +"</span></div></div>");
				}
			});
			$("#fdav").text(Math.round(1000*fdav/(33 * stats.length))/10 + "%");
			$("#sdav").text(Math.round(1000*sdav/(33 * stats.length))/10 + "%");
			$("#tdav").text(Math.round(1000*tdav/(33 * stats.length))/10 + "%");
			$("#adav").text(Math.round(1000*adav/(99 * stats.length))/10 + "%");

			$("#fdpav").text(Math.round(10*fdpav/(33 * stats.length))/10 );
			$("#sdpav").text(Math.round(10*sdpav/(33 * stats.length))/10 );
			$("#tdpav").text(Math.round(10*tdpav/(33 * stats.length))/10 );
			$("#adpav").text(Math.round(10*adpav/(99 * stats.length))/10 );
		}
		$( "#stats-view" ).fadeIn( "fast", function() {});
	}

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
			var percentage = Math.round(1000*hits/thrown)/10;
			$("#hits-stats").text(hits + " (" + percentage + "%)");
		}
		else{
			$("#hits-stats").text("0/0");
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
		if(thrown == 99){
			$("#next").text("END GAME");
			$("#next").css("background-color","#96ce5a")
		}
		else{
			$("#next").text("NEXT ►");
			$("#next").css("background-color","#032237")
		}
	}
});






var chordName = (function(o){

	var noteMap = [];
	var scaleMap = [];
	var bassNoteName = "";
	var suggestionName = [];

	var rootName = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
	var basicChordName = [ " " , "m" , "7" , "dim"];

	//C=0,D=2,E=4,F=5,G=7,A=9,B=11
	//var stringInitScale = [4,9,14,19,23,28];
	var stringInitScale = [28,23,19,14,9,4];

	var extensionChordAnalysis = function(){



	}

	var basicChordAnalysis = function(){
		if(scaleMap[1] == 4 && scaleMap[2] == 7){
			suggestionName.push(bassNoteName + "maj");
		}
		if(scaleMap[1] == 3 && scaleMap[2] == 7){
			suggestionName.push(bassNoteName + "m");	
		}
		if(scaleMap[1] == 3 && scaleMap[2] == 6){
			suggestionName.push(bassNoteName + "dim");
		}
		if(scaleMap[1] == 4 && scaleMap[2] == 10){
			suggestionName.push(bassNoteName + "7");	
		}
		if(scaleMap[1] == 3 && scaleMap[2] == 10){
			suggestionName.push(bassNoteName + "m7");
		}
		if(scaleMap[1] == 4 && scaleMap[2] == 11){
			suggestionName.push(bassNoteName + "maj7");
		}
		if(scaleMap[1] == 3 && scaleMap[2] == 11){
			suggestionName.push(bassNoteName + "m maj7");
		}		
	}

	var chordAnalysis = function(){		
		if(scaleMap.length === 2){
			if(scaleMap[1] === 4)
				suggestionName.push(bassNoteName+"_powerChord");
		}
		else if(scaleMap.length === 3){
			basicChordAnalysis();
		}
		else{			
			extensionChordAnalysis();
		}
	}


	var mapNote = function(){		
		//sort 		
		noteMap.sort(function(a,b){return a - b});
		
		//get basenote
		var bassNote = noteMap[0];
		bassNote = bassNote % 12;		
		bassNoteName = rootName[bassNote];		
		suggestionName.push(bassNoteName);

		var note;
		var filterNoteMap = [];
		var isRepeat = false;
		//filter repeat note
		for(var i=0 ; i<noteMap.length ;i++){
			note = noteMap[i] %12;
			isRepeat = false
			for(var j = 0 ; j < filterNoteMap.length ; j++){
				if(note === filterNoteMap[j])
					isRepeat = true;
			}

			if(!isRepeat)
				filterNoteMap.push(note);
		}
		console.log(filterNoteMap);							
		scaleMap.push(0);	
		for(var i=1 ;i<filterNoteMap.length ; i++){
			var scale = filterNoteMap[i]-filterNoteMap[0];
			if(scale < 0)
				scale += 12;
			scaleMap.push(scale);
		}
		console.log(scaleMap);
		scaleMap.sort(function(a,b){return a-b });
	}
	
	o.queryChordName = function(noteArray){
		suggestionName = [];
		noteMap = [];
		scaleMap= [];
		//noteArray like [0, 0, 3, 3, 0, 1] the first is the highest string
		//normally get it from chord_diagram.getOutputArray();		
		var note;
		for(var i = 0 ; i < 6 ; i++){			
			note = noteArray[i];
			if(note > -1){
				noteMap.push(stringInitScale[i] + note);
			}			
		}
		mapNote();
		chordAnalysis();
		return suggestionName;
	}




	return o;

})( chordName || {} );
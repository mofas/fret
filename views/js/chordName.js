

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
		//only handle four note.
		if(scaleMap[1] == 1){
			if(scaleMap[2] == 3 && scaleMap[3] == 10){
				suggestionName.push(bassNoteName + "m7b9");
			}
			else if(scaleMap[2] == 4 && scaleMap[3] == 10){
				suggestionName.push(bassNoteName + "7-9");
				suggestionName.push(bassNoteName + "7b9");
			}

		}
		else if(scaleMap[1] == 2){
			if(scaleMap[2] == 4 && scaleMap[3] == 9){
				suggestionName.push(bassNoteName + "6,9");
			}
			else if(scaleMap[2] == 4 && scaleMap[3] == 10){
				suggestionName.push(bassNoteName + "9");
			}
			else if(scaleMap[2] == 4 && scaleMap[3] == 11){
				suggestionName.push(bassNoteName + "maj9");
			}

		}
		else if(scaleMap[1] == 3){
			if(scaleMap[2] == 6 && scaleMap[3] == 9){
				suggestionName.push(bassNoteName + "dim7");
			}
			else if(scaleMap[2] == 6 && scaleMap[3] == 10){
				suggestionName.push(bassNoteName + "m7b5");
			}
			else if(scaleMap[2] == 4 && scaleMap[3] == 10){
				suggestionName.push(bassNoteName + "7+9");
				suggestionName.push(bassNoteName + "7#9");
			}
			else if(scaleMap[2] == 6 && scaleMap[3] == 11){
				suggestionName.push(bassNoteName + "m11#");
			}
			else if(scaleMap[2] == 7 && scaleMap[3] == 9){
				suggestionName.push(bassNoteName + "m6");
			}

		}
		else if(scaleMap[1] == 4){
			if(scaleMap[2] == 7 && scaleMap[3] == 9){
				suggestionName.push(bassNoteName + "6");
			}
			else if(scaleMap[2] == 5 && scaleMap[3] == 10){
				suggestionName.push(bassNoteName + "11");
			}
			else if(scaleMap[2] == 6 && scaleMap[3] == 10){
				suggestionName.push(bassNoteName + "7-5");
			}
			else if(scaleMap[2] == 8 && scaleMap[3] == 10){
				suggestionName.push(bassNoteName + "aug7");
			}
			else if(scaleMap[2] == 9 && scaleMap[3] == 10){
				suggestionName.push(bassNoteName + "13");
			}
		}

	}

	var basicChordAnalysis = function(){
		//only handle three note
		if(scaleMap[1] == 3){
			if(scaleMap[2] == 7){
				suggestionName.push(bassNoteName + "m");
			}
			else if(scaleMap[2] == 6){
				suggestionName.push(bassNoteName + "dim");	
			}
			else if(scaleMap[2] == 10){
				suggestionName.push(bassNoteName + "m7");
			}
			else if(scaleMap[2] == 11){
				suggestionName.push(bassNoteName + "m_maj7");
			}
		}
		else if(scaleMap[1] == 2){
			if(scaleMap[2] == 4){
				suggestionName.push(bassNoteName + "add9");	
			}			
		}
		else if(scaleMap[1] == 4){
			if(scaleMap[2] == 7){
				suggestionName.push(bassNoteName + "maj");
			}
			else if(scaleMap[2] == 8){
				suggestionName.push(bassNoteName + "+"); 
			}			
			else if(scaleMap[2] == 10){
				suggestionName.push(bassNoteName + "7");
			}
			else if(scaleMap[2] == 11){
				suggestionName.push(bassNoteName + "maj7");
			}
		}
		else if(scaleMap[1] == 5){
			if(scaleMap[2] == 10){
				suggestionName.push(bassNoteName + "7sus4");
			}
		}
	}

	var twoNotesAnalysis = function(){
		if(scaleMap[1] == 3){
			suggestionName.push(bassNoteName + "m");
		}			
		else if(scaleMap[1] == 4){
			//suggestionName.push(bassNoteName);
		}			
		else if(scaleMap[1] == 5){
			suggestionName.push(bassNoteName + "sus4");
		}			
		else if(scaleMap[1] == 7){
			suggestionName.push(bassNoteName + "_powerChord");
		}			
	}

	var fiveNoteAnalysis = function(){
		if(scaleMap[1] == 2 && scaleMap[2] == 4){
			if(scaleMap[3] == 5 && scaleMap[4] == 10){
				suggestionName.push(bassNoteName + "11");
			}
			else if(scaleMap[3] == 9 && scaleMap[4] == 10){
				suggestionName.push(bassNoteName + "13");
			}
		}
		else if(scaleMap[1] == 4 && scaleMap[2] == 5 && scaleMap[3] == 9 && scaleMap[4] == 11){
			suggestionName.push(bassNoteName + "maj11,13");
		}
	}

	var chordAnalysis = function(){		
		if(scaleMap.length == 2){
			twoNotesAnalysis();
		}
		else if(scaleMap.length == 3){
			basicChordAnalysis();
		}
		else if(scaleMap.length == 4){
			//there have 5th note
			if(scaleMap[2] == 7){
				scaleMap.splice(2,1);
				basicChordAnalysis();
			}
			else{
				extensionChordAnalysis();	
			}			
		}
		else if(scaleMap.length == 5){
			if(scaleMap[2] == 7){
				scaleMap.splice(2,1);
				extensionChordAnalysis();
			}
			else{
				fiveNoteAnalysis();	
			}			
		}
		//I dont want to handle note > 5
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

		scaleMap.push(0);	
		for(var i=1 ;i<filterNoteMap.length ; i++){
			var scale = filterNoteMap[i]-filterNoteMap[0];
			if(scale < 0)
				scale += 12;
			scaleMap.push(scale);
		}		
		scaleMap.sort(function(a,b){return a-b });
		console.log(scaleMap);
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
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


var chordName = (function(o){

	var noteMap = [],
		scaleMap = [],
		suggestionName = [],
		bassNoteName = "",
		rootNoteName = "";
	var rotatingOrder = 0;
	var suggestionNameLength = 0;
	var _callback;
	var workerTimer = null;

	var rootName = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];	

	//C=0,D=2,E=4,F=5,G=7,A=9,B=11
	//var stringInitScale = [4,9,14,19,23,28];
	var stringInitScale = [28,23,19,14,9,4];

	var extensionChordAnalysis = function(){
		//only handle four note.
		if(scaleMap[1] == 1){
			if(scaleMap[2] == 3 && scaleMap[3] == 10){
				suggestionName.push(rootNoteName + "m7b9");
			}
			else if(scaleMap[2] == 4 && scaleMap[3] == 10){
				suggestionName.push(rootNoteName + "7-9");
				suggestionName.push(rootNoteName + "7b9");
			}

		}
		else if(scaleMap[1] == 2){
			if(scaleMap[2] == 4 && scaleMap[3] == 9){
				suggestionName.push(rootNoteName + "6,9");
			}
			else if(scaleMap[2] == 4 && scaleMap[3] == 10){
				suggestionName.push(rootNoteName + "9");
			}
			else if(scaleMap[2] == 4 && scaleMap[3] == 11){
				suggestionName.push(rootNoteName + "maj9");
			}

		}
		else if(scaleMap[1] == 3){
			if(scaleMap[2] == 6 && scaleMap[3] == 9){
				suggestionName.push(rootNoteName + "dim7");
			}
			else if(scaleMap[2] == 6 && scaleMap[3] == 10){
				suggestionName.push(rootNoteName + "m7b5");
			}
			else if(scaleMap[2] == 4 && scaleMap[3] == 10){
				suggestionName.push(rootNoteName + "7+9");
				suggestionName.push(rootNoteName + "7#9");
			}
			else if(scaleMap[2] == 6 && scaleMap[3] == 11){
				suggestionName.push(rootNoteName + "m11#");
			}
			else if(scaleMap[2] == 7 && scaleMap[3] == 9){
				suggestionName.push(rootNoteName + "m6");
			}

		}
		else if(scaleMap[1] == 4){
			if(scaleMap[2] == 7 && scaleMap[3] == 9){
				suggestionName.push(rootNoteName + "6");
			}
			else if(scaleMap[2] == 5 && scaleMap[3] == 10){
				suggestionName.push(rootNoteName + "11");
			}
			else if(scaleMap[2] == 6 && scaleMap[3] == 10){
				suggestionName.push(rootNoteName + "7-5");
			}
			else if(scaleMap[2] == 8 && scaleMap[3] == 10){
				suggestionName.push(rootNoteName + "aug7");
			}
			else if(scaleMap[2] == 9 && scaleMap[3] == 10){
				suggestionName.push(rootNoteName + "13");
			}
		}

	}

	var basicChordAnalysis = function(){
		//only handle three note
		if(scaleMap[1] == 3){
			if(scaleMap[2] == 7){
				suggestionName.push(rootNoteName + "m");
			}
			else if(scaleMap[2] == 6){
				suggestionName.push(rootNoteName + "dim");	
			}
			else if(scaleMap[2] == 10){
				suggestionName.push(rootNoteName + "m7");
			}
			else if(scaleMap[2] == 11){
				suggestionName.push(rootNoteName + "m_maj7");
			}
		}
		else if(scaleMap[1] == 2){
			if(scaleMap[2] == 4){
				suggestionName.push(rootNoteName + "add9");	
			}			
		}
		else if(scaleMap[1] == 4){
			if(scaleMap[2] == 7){
				suggestionName.push(rootNoteName + "maj");
			}
			else if(scaleMap[2] == 8){
				suggestionName.push(rootNoteName + "+"); 
			}			
			else if(scaleMap[2] == 10){
				suggestionName.push(rootNoteName + "7");
			}
			else if(scaleMap[2] == 11){
				suggestionName.push(rootNoteName + "maj7");
			}
		}
		else if(scaleMap[1] == 5){
			if(scaleMap[2] == 10){
				suggestionName.push(rootNoteName + "7sus4");
			}
		}
	}

	var twoNotesAnalysis = function(){
		if(scaleMap[1] == 3){
			suggestionName.push(rootNoteName + "m");
		}			
		else if(scaleMap[1] == 4){
			suggestionName.push(rootNoteName);
		}			
		else if(scaleMap[1] == 5){
			suggestionName.push(rootNoteName + "sus4");
		}			
		else if(scaleMap[1] == 7){
			suggestionName.push(rootNoteName + "_powerChord");
		}			
	}

	var fiveNoteAnalysis = function(){
		if(scaleMap[1] == 2 && scaleMap[2] == 4){
			if(scaleMap[3] == 5 && scaleMap[4] == 10){
				suggestionName.push(rootNoteName + "11");
			}
			else if(scaleMap[3] == 9 && scaleMap[4] == 10){
				suggestionName.push(rootNoteName + "13");
			}
		}
		else if(scaleMap[1] == 4 && scaleMap[2] == 5 && scaleMap[3] == 9 && scaleMap[4] == 11){
			suggestionName.push(rootNoteName + "maj11,13");
		}
	}

	var chordAnalysis = function(){		
		if(scaleMap.length == 2){
			twoNotesAnalysis();
			return;
		}

		scaleMap.remove(7);
		if(scaleMap.length == 2){
			twoNotesAnalysis();
		}
		if(scaleMap.length == 3){
			basicChordAnalysis();
		}
		else if(scaleMap.length == 4){													
			extensionChordAnalysis();				
		}
		else if(scaleMap.length == 5){
			extensionChordAnalysis();
			fiveNoteAnalysis();
		}
		//I dont want to handle note > 5
	}


	var mapNote = function(){		
		//sort 		
		noteMap.sort(function(a,b){return a - b});
		
		//get bassnote
		var bassNote = noteMap[0];
		bassNote = bassNote % 12;		
		bassNoteName = rootName[bassNote];				

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
		//noteMap is original note map 
		noteMap = filterNoteMap;
		rootNoteRotating();
	}


	var rootNoteRotating = function(){
		if(rotatingOrder < noteMap.length){
			var rotatingMap = noteMap.slice();			
			for(var r = 0; r < rotatingOrder ;r++){
				rotatingMap.push(rotatingMap[0]);
				rotatingMap.shift();
			}			
			//record rootNote
			var rootNote = rotatingMap[0];			
			rootNote = rootNote % 12;		
			rootNoteName = rootName[rootNote];
			scaleMap = [];
			scaleMap.push(0);	
			for(var i=1 ;i < rotatingMap.length ; i++){
				var scale = rotatingMap[i]-rotatingMap[0];
				if(scale < 0)
					scale += 12;
				scaleMap.push(scale);
			}		
			scaleMap.sort(function(a,b){return a-b });

			//console.log("scale" , scaleMap);
			chordAnalysis();
					
			var currentSuggestionNameLength = suggestionName.length;			
			if(rotatingOrder > 0 && currentSuggestionNameLength > suggestionNameLength){
				for(var i = suggestionNameLength; i < currentSuggestionNameLength ; i++){
					suggestionName[i] = suggestionName[i] + "/" + bassNoteName;
				}				
			}

			suggestionNameLength = currentSuggestionNameLength;

			rotatingOrder++;
			workerTimer = setTimeout(arguments.callee , 1);

		}
		else{
			if(typeof _callback === 'function'){
				_callback(suggestionName);
			}				
		}

	}
	
	o.queryChordName = function(noteArray , callback){
		reset();
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
		_callback = callback;
	}

	var reset = function(){
		clearTimeout(workerTimer);
		suggestionName = [];
		noteMap = [];
		scaleMap= [];
		rotatingOrder = 0;
		suggestionNameLength = 0;
	}

	o.getSuggestionName = function(){
		return suggestionName;
	}



	return o;

})( chordName || {} );
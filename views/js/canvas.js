

var canvas_chord_diagram = (function(o){

	var canvas,ctx,W,H,diagramW,
		chordName,
		fingerIndex,first_fret=24, last_fret=0, 
		fretDiff,fretW;

	function drawBasicLayout(){	
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#333";
		for(var i = 0 ; i < 6 ; i++){		
			ctx.moveTo(22, 35+i*24);
			ctx.lineTo(diagramW, 35+i*24);
		}		
		for(var i = 0; i < fretDiff ; i++){
			ctx.moveTo(diagramW-i*fretW, 33);
			ctx.lineTo(diagramW-i*fretW, 157);
		}
		ctx.stroke();
	}

	function drawChordName(){
		ctx.font = 'italic bold 20px sans-serif';
		ctx.textBaseline = 'bottom';
		ctx.fillStyle = "#333"
		if(chordName === null || chordName.length < 1){
			chordName = "Chord" + fingerIndex.join("");
			chordName = chordName.replace(/\-1/g , "-");
		}
		ctx.fillText(chordName , diagramW/2 + 10 - chordName.length*5 , 20);	
		
	}

	function drawChord(){
		var position;

		ctx.font = 'italic bold 20px sans-serif';
		ctx.textBaseline = 'bottom';
		ctx.fillStyle = "#333";
		if(first_fret > 1){
			ctx.fillText(first_fret , 15 + 0.5*fretW , 27);			
			ctx.beginPath();
			ctx.moveTo(21, 33);
			ctx.lineTo(21, 157);
			ctx.strokeStyle = "#333";
			ctx.lineWidth = 3;
			ctx.stroke();
		}		
		else{
			ctx.beginPath();
			ctx.moveTo(20, 33);
			ctx.lineTo(20, 157);
			ctx.strokeStyle = "#333";
			ctx.lineWidth = 10;
			ctx.stroke();
		}

		for(var i=0; i < fingerIndex.length ;i++){			
			if(fingerIndex[i] > 0){
				ctx.beginPath();
				position = diagramW - 0.5*fretW - ((last_fret - fingerIndex[i] + 1)*fretW);								
				if(first_fret > 1 || (first_fret = 1 && fretDiff >= 4)){
					position += fretW;					
				}				
				ctx.arc(position, 35+i*24, 10, 0, Math.PI*2 , false); 
				ctx.fillStyle = "#333";		
				ctx.fill();
			}			
			else if(isNaN(parseInt(fingerIndex[i])) || parseInt(fingerIndex[i]) < 0){
				ctx.beginPath();
				ctx.strokeStyle = "#333";
				ctx.lineWidth = 3;
				ctx.moveTo(2 , 30+i*24);
				ctx.lineTo(12 , 40+i*24);
				ctx.moveTo(12 , 30+i*24);
				ctx.lineTo(2 , 40+i*24);
				ctx.stroke();
			}			
		}	
	}

	function reDraw(){
		if(ctx === undefined){
			initCanvas();
		}
		else{
			ctx.clearRect ( 0 , 0 , W , H );
		}
		draw();		
	}

	function draw(){

		first_fret=24, last_fret=0, fretDiff;
		for(var i=0; i < fingerIndex.length ;i++){
			if(fingerIndex[i] < first_fret && fingerIndex[i] > 0)
				first_fret = fingerIndex[i];
			if(fingerIndex[i] > last_fret)
				last_fret = fingerIndex[i];
		}
		fretDiff = last_fret - first_fret + 1;
		if(last_fret < 4){
			last_fret = 4;
			first_fret = 1;
			fretDiff = 4;
		}
		if(fretDiff < 4){
			last_fret = first_fret + 3;
			fretDiff = 4;
		}
		diagramW = W-20;

		fretW = (diagramW-20)/fretDiff; //15 mean left
		drawBasicLayout();
		drawChordName();
		drawChord();
	}

	function initCanvas(){
		canvas = document.createElement('canvas');
		canvas.width = 250; 
		canvas.height = 180;
		//TEST CODE
		//$('body').append(canvas);
		ctx = canvas.getContext("2d");
		W = canvas.width;
		H = canvas.height;
	}

	o.init = function(){		
		initCanvas();
		//fingerIndex is an array has 6 element represents the index in the fret.
		fingerIndex =  [0,3,0,3,4,2];
		draw();
	}

	o.saveAsImage = function(){				
		var strDownloadMime = "image/octet-stream";
		var saveFile = function(strData) {
			document.location.href = strData;
		}
		var strData = canvas.toDataURL("image/png");		
		saveFile(strData.replace("image/png", strDownloadMime));
	}

	o.setFingerIndex = function(name , indexArray){
		if(indexArray instanceof Array && indexArray.length == 6){
			chordName = name;
			fingerIndex = indexArray;
			reDraw();
		}		
	}

	o.getFingerIndex = function(){
		return fingerIndex;
	}

	o.getCanvas = function(){
		var returnCanvas = canvas.cloneNode();
		var destCtx = returnCanvas.getContext('2d');
		destCtx.drawImage(canvas, 0, 0);
		return returnCanvas;
	}	

	return o;

})(canvas_chord_diagram || {});
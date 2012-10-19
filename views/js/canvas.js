
$(function(){			
	canvas_chord_diagram.init();
});



var canvas_chord_diagram = (function(o){

	var canvas,ctx,W,H,
		fingerIndex,first_fret=24, last_fret=0, 
		fretDiff,fretW;

	function drawBasicLayout(){				
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, W, H);

		ctx.beginPath();
		ctx.moveTo(30, 33);
		ctx.lineTo(30, 157);
		ctx.strokeStyle = "#333";
		ctx.lineWidth = 10;
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#333";
		for(var i = 0 ; i < 6 ; i++){		
			ctx.moveTo(25, 35+i*24);
			ctx.lineTo(300, 35+i*24);
		}		
		for(var i = 0; i < fretDiff ; i++){
			ctx.moveTo(30+i*fretW, 33);
			ctx.lineTo(30+i*fretW, 157);
		}
		ctx.stroke();
	}

	function drawChord(){				
		var position = 30 + 0.5*fretW;

		ctx.font = 'italic bold 20px sans-serif';
		ctx.textBaseline = 'bottom';
		ctx.fillStyle = "#333"
		ctx.fillText(first_fret , 25 + 0.5*fretW , 27);

		for(var i=0; i < fingerIndex.length ;i++){			
			if(fingerIndex[i] > 0){
				ctx.beginPath();
				position = 30 + 0.5*fretW + ((fingerIndex[i]-first_fret)*fretW) ;
				ctx.arc(position, 35+i*24, 10, 0, Math.PI*2 , false); 
				ctx.fillStyle = "#333";		
				ctx.fill();
			}

			else if(fingerIndex[i] < 0){
				ctx.beginPath();
				ctx.strokeStyle = "#333";
				ctx.lineWidth = 3;
				ctx.moveTo(10 , 30+i*24);
				ctx.lineTo(20 , 40+i*24);
				ctx.moveTo(20 , 30+i*24);
				ctx.lineTo(10 , 40+i*24);
				ctx.stroke();
			}			
		}	
	}

	function reDraw(){
		ctx.clearRect ( 0 , 0 , W , H );
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
		fretW = 280/fretDiff;
		drawBasicLayout();
		drawChord();
	}

	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");
		W = canvas.width;
		H = canvas.height;

		//fingerIndex is an array has 6 element represents the index in the fret.
		fingerIndex =  [0,1,0,2,3,0];
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

	o.setFingerIndex = function(indexArray){		
		if(indexArray instanceof Array && indexArray.length == 6){
			fingerIndex = indexArray;
			reDraw();
		}
	}

	return o;

})(canvas_chord_diagram || {});


var chord_collection = (function(o){

	var fingerIndexMap = ["-","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"];
	var chordCollection = [];	
	var uuID = 0;
	//chordObj
    var chordObj = function(canvas , fingerIndex){
	    this.index = uuID++;
	    this.canvas = canvas;
	    this.fingerIndex = fingerIndex;
	};

	o.add = function(canvas , fingerIndex){
		var newObj = new chordObj(canvas , fingerIndex);
		chordCollection.push(newObj);
		return newObj.index;
	}

	o.delete = function(uuID){
		var length = chordCollection.length;
		while(length--){
			if(chordCollection[length].index == uuID){
				chordCollection.splice(length , 1);
			}
		}
	}

	o.get = function(uuID){
		var length = chordCollection.length;
		while(length--){
			if(chordCollection[length].index == uuID){
				return chordCollection[length];
			}
		}
	}

	o.update = function(uuID , canvas , fingerIndex){
		var length = chordCollection.length;
		while(length--){
			if(chordCollection[length].index == uuID){
				chordCollection[length].canvas = canvas;
				chordCollection[length].fingerIndex = fingerIndex;
			}
		}
	}

	o.getCollection = function(){
		return chordCollection;
	}

	o.outputCollectionImage = function(){
		var length = chordCollection.length;

		var canvasWidth = length*320 , canvasHeight = Math.ceil(length/3)*180 + 20;
		if(canvasWidth > 960 )
			canvasWidth = 960;

		var outputCanvas = document.createElement('canvas');		
		outputCanvas.width = canvasWidth; 
		outputCanvas.height = canvasHeight;
		var outputCanvasCtx = outputCanvas.getContext('2d');		

		//Test Code
		//$('body').append(outputCanvas);
		var imageData;		
		for(var i = 0 ; i < length ; i++){
			imageData = chordCollection[i].canvas;
			outputCanvasCtx.drawImage(imageData,(i%3)*320 ,Math.floor(i/3)*180+10);
		}
		var strDownloadMime = "image/octet-stream";
		var saveFile = function(strData) {
			document.location.href = strData;
		}
		var strData = outputCanvas.toDataURL("image/png");
		saveFile(strData.replace("image/png", strDownloadMime));
	}


	o.outputCollectionURL = function(){
		var length = chordCollection.length;
		var fingerIndex , outputURLFragment = [] , outputURL=[];		
		for(var i = 0; i < length ;i++){
			outputURLFragment=["&c="];
			fingerIndex = chordCollection[i].fingerIndex;			
			for(var j = 0; j < fingerIndex.length ;j++){				
				outputURLFragment.push(fingerIndexMap[fingerIndex[j]+1]);				
			}			
			outputURL.push(outputURLFragment.join("")); 
		}		
		return outputURL.join("");
	}

	return o;

})(chord_collection || {});
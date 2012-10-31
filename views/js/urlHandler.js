



window.initGoogleAPI	= function(){
	gapi.client.setApiKey('AIzaSyATKgocs2ylWRGBQiwrQIN_BEo4E6w2QGM');	
	urlHandler.shorturlCallback();
}


var urlHandler = (function(o){	
	var fingerIndexMap = ["-","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"];
	var $outputLink , $loadingMsg;

	var originURL = "" , 
		shortURL = "" ,  
		URLIsChanged = false;


	o.init = function($el1 , $el2){
		$outputLink = $el1;
		$loadingMsg = $el2;
	}	

	o.parseNoteByURL = function(){		
		var param =  window.location.href.split("?")[1] , 
			collection , strArray , intArray , diagramArray , noteInfo;
		//chord collection
		if(param === undefined){
			chord_diagram.setoutputArray([0,0,0,0,0,0]);
			chord_diagram.parseNote();
			return;
		}

		collection = param.split("&c=").slice(1);				
		for(var i =0; i < collection.length ;i++){
			strArray = collection[i].split("");
			intArray = new Array();
			for(var j=0;j < strArray.length;j++){
				var index = isNaN(parseInt(strArray[j] , 10)) ? -1 : parseInt(strArray[j] , 10);								
				intArray.push(index);				
			}										
			chord_diagram.setoutputArray(intArray);			
			main.addByArray(intArray);
		}
		
		noteInfo = param.substring(param.indexOf("note=")+5 , param.indexOf("note=")+11);
		diagramArray = new Array(6);
		if(noteInfo.length > 0 ){						
			var fingerIndexString = fingerIndexMap.join("");
			var rawArray = noteInfo.split("");
			for(var i = 0 ; i < rawArray.length ; i++){
				diagramArray[i] = fingerIndexString.indexOf(rawArray[i])-1;
			}
			chord_diagram.setoutputArray(diagramArray);
		}
		else{
			chord_diagram.setoutputArray([0,0,0,0,0,0]);
		}
		
		chord_diagram.parseNote();
	}


	o.shortUrl = function(){
		showLoadingMsg();
        if(shortURL.length < 1 || URLIsChanged){
        	if(window.gapi === undefined){
        		$.getScript("https://apis.google.com/js/client.js?onload=initGoogleAPI");
        	}
        	else{
        		o.shorturlCallback();        		
        	}	        	
        }else{        	
        	$outputLink.val(shortURL);
        	hideLoadingMsg();
        }	    
	}

	o.resetUrl = function(){
		$outputLink.val(originURL);		
	}

	o.shorturlCallback = function(){
		gapi.client.load('urlshortener', 'v1', function(){
			var request = gapi.client.urlshortener.url.insert({
				'resource': {'longUrl': originURL}
			});
			request.execute(function(response) {					
				shortURL = response.id;				
				URLIsChanged = false;
				$outputLink.val(shortURL);
				hideLoadingMsg();
			});
		});
	}

	var showLoadingMsg = function(){
		$outputLink.prop('disabled', true);	
		$loadingMsg.show();
	}

	var hideLoadingMsg = function(){
		$outputLink.prop('disabled', false).focus().select();
		$loadingMsg.hide();
	}

	o.output = function(){
		var outputString = "note=";
		var outputArray = chord_diagram.getOutputArray();
		for(var i = 0 ,arrIndex = outputArray.length ; i < arrIndex ; i++){
			outputString += fingerIndexMap[outputArray[i]+1];
		}
		//collection
		outputString += chord_collection.outputCollectionURL();
		var urlEnd = (window.location.href.lastIndexOf("?") > 0) ? window.location.href.lastIndexOf("?") : window.location.href.length;
		var url = window.location.href.substring( 0 , urlEnd ) + "?" + outputString;
		checkURLIsChanged(url);		
		return url;
	}

	var checkURLIsChanged = function(url){
		if(originURL !== url){
			URLIsChanged = true;
			originURL = url;
			shortURL = "";
		}
		else{
			URLIsChanged = false;
		}
	}
	

	return o;

})(urlHandler || {});
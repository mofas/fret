
$(function(){			
	urlHandler.init();
});



window.initGoogleAPI	= function(){
	gapi.client.setApiKey('AIzaSyATKgocs2ylWRGBQiwrQIN_BEo4E6w2QGM');	
	urlHandler.shorturlCallback();
}


var urlHandler = (function(o){	
	var fingerIndexMap = ["-","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"],
		$outputLink,
		$loadingMsg,
		originURL = "" , 
		shortURL = "" ,  
		URLIsChanged = false;


	// o.init = function($el1 , $el2){
	// 	$outputLink = $el1;
	// 	$loadingMsg = $el2;
	o.init = function(){
		var $outputLinkWrap = $(".outputLinkWrap");
		$outputLink = $("#outputLink");
		$loadingMsg = $outputLinkWrap.find(".loadingMsg");
		$.subscribe("urlHandler/init" , parseNoteByURL);
		$.subscribe("urlHandler/shortUrl" , shortUrl);
		$.subscribe("urlHandler/resetUrl" , resetUrl);
		$.subscribe("urlHandler/refreshURLLink" , refreshURLLink);
		$.subscribe("urlHandler/changeURL" , changeURL);
	}	

	var parseNoteByURL = function(){		
		var param =  window.location.href.split("?")[1] || "", 
			chordName,
			collection,
			strArray,
			intArray,
			diagramArray,
			noteInfo;

		//chord collection
		if(param === null){
			chord_diagram.setoutputArray([0,0,0,0,0,0]);
			chord_diagram.parseNote();
			return;
		}

		collection = param.split("&").slice(1);
		for(var i =0; i < collection.length ;i++){
			chordName = decodeURIComponent(collection[i].split("=")[0]);
			strArray = collection[i].split("=")[1];
			intArray = new Array();
			for(var j=0;j < strArray.length;j++){
				var index = isNaN(parseInt(strArray[j] , 10)) ? -1 : parseInt(strArray[j] , 10);								
				intArray.push(index);				
			}										
			
			main.addByArray(chordName , intArray);
		}
		
		noteInfo = param.substring(param.indexOf("note=")+5 , param.indexOf("note=")+11);
		diagramArray = new Array(6);
		if(noteInfo.length > 0 ){						
			var fingerIndexString = fingerIndexMap.join(""),
				rawArray = noteInfo.split("");
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


	var shortUrl = function(){
		showLoadingMsg();
        if(shortURL.length < 1 || URLIsChanged){
        	if(window.gapi == null){
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

	var resetUrl = function(){
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

	var output = function(){
		var outputString = "note=",
			outputArray = chord_diagram.getOutputArray();
			
		for(var i = 0 ,arrIndex = outputArray.length ; i < arrIndex ; i++){
			outputString += fingerIndexMap[outputArray[i]+1];
		}
		//collection
		outputString += chord_collection.outputCollectionURL();
		var urlEnd = (window.location.href.lastIndexOf("?") > 0) ? window.location.href.lastIndexOf("?") : window.location.href.length,
			url = window.location.href.substring( 0 , urlEnd ) + "?" + outputString;
		checkURLIsChanged(url);				
		return url;
	}

	var refreshURLLink = function(){		
		var url = output();
		$outputLink.val(url).focus().select();
	}

	var changeURL = function(){
		var url = output();
		window.history.replaceState(null , "線上和絃編輯工具 | 吉他好朋友" , url);
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
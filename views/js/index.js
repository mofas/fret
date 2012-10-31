$(function(){			
	main.init();
});


var main = (function(o){

	var fingerIndexMap = ["-","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"];
	var $chordDiagram , $chordList , $outputLinkWrap, $outputLink ,
		urlObj = {},
		inputMode = 0;

	urlObj.origin = ""; 
	urlObj.short = ""; 
	urlObj.isChange = false;

	o.shorturlCallback = function(){
		gapi.client.load('urlshortener', 'v1', function(){
			var request = gapi.client.urlshortener.url.insert({
				'resource': {'longUrl': urlObj.origin}           					
			});
			request.execute(function(response) {          					
					var shorturl = response.id;
					console.log(shorturl);
					urlObj.short = shorturl;	        				
				urlObj.isChange = false;
				$outputLink.val(urlObj.short);
			});
		});
	}

	var parseNoteByURL = function(){		
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
			intArray = new Array(6);
			for(var j=0;j < strArray.length;j++){
				intArray[j] = isNaN(parseInt(strArray[j] , 10)) ? -1 : parseInt(strArray[j] , 10);
			}			
			chord_diagram.setoutputArray(intArray);
			add(intArray);
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

	var bindEvent = function(){
		$chordList = $("#chordList");
		$chordDiagram = $('.chord_diagramWrap');
		$outputLink = $("#outputLink");
		$chordList.on("click", ".chordItem" , function(){			
			$(this).siblings().removeClass("selected").end().addClass("selected");			
		});
		$("#addButton").on("click" , o.add);
		$("#updateButton").on("click" , o.update);
		$("#cancelButton").on("click" , o.cancel);
		$("#saveImageButton").on("click" , o.saveAsImage);
		$("#outputURLButton").on("click" , o.output);
		$("#shorturl").on("mousedown" , shortUrlEvent);
	}

	var shortUrlEvent = function(){				
	    if (!$(this).is(':checked')) {	        
	        $(this).trigger("change");	        
	        if(urlObj.short.length < 1 || urlObj.isChange){
	        	if(window.gapi === undefined){
	        		$.getScript("https://apis.google.com/js/client.js?onload=initGoogleAPI");
	        	}
	        	else{
	        		o.shorturlCallback();
	        	}	        	
	        }else{
	        	$outputLink.val(urlObj.short);
	        }
	    }
	    else{
	    	$outputLink.val(urlObj.origin);
	    }
	}

	var checkURLIsChanged = function(url){
		if(urlObj.origin !== url){
			urlObj.isChange = true;
			urlObj.origin = url;
			urlObj.short = "";
		}
		else{
			urlObj.isChange = false;
		}
	}
	var bindHideOutputEvent = function(){
		$chordDiagram.add($chordList).one("click" , hidenOutputEvent);
	}

	var hidenOutputEvent = function(){
		$chordList.off("click" , hidenOutputEvent);
		$chordDiagram.off("click" , hidenOutputEvent);		
		$outputLinkWrap.css({visibility: 'hidden'});
		$("#shorturl").attr('checked', false);
	}

	o.init	=	function(){
		var $strings = $(".string");
		var $muteButtonWrap = $(".mutebuttonWrap");
		$outputLinkWrap = $(".outputLinkWrap");
		chord_diagram.init($strings , $muteButtonWrap);
		parseNoteByURL();
		bindEvent();
	}	

	o.saveAsImage = function(){
		chord_collection.outputCollectionImage();
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
		//var link = '<a traget="_blank" href="'+url+'">'+url+'</a>';		
		$outputLinkWrap.css({visibility: 'visible'});
		checkURLIsChanged(url);
		bindHideOutputEvent();
		$outputLink.val(url);		
	}

	o.add = function(){
		var outputArray = chord_diagram.getOutputArray();		
		add(outputArray);
	}

	var add = function(outputArray){		
		canvas_chord_diagram.setFingerIndex(outputArray);
		var index = chord_collection.add(canvas_chord_diagram.getCanvas() , outputArray.slice());
		var buttonHtml = '<a class="button" href="javascript:null;" onclick="javascript:main.edit(this , '+index+');" >編輯</a>'
							+'<a class="button delete" href="javascript:null;" onclick="main.delete(this , '+index+');">刪除</a>'
		var fragmentHtml = $('<li class="chordItem"></li>');
		fragmentHtml.append(canvas_chord_diagram.getCanvas());
		fragmentHtml.append($(buttonHtml));
		$("#chordList").append(fragmentHtml);
	}

	o.edit = function(obj , id){
		var chordObj = chord_collection.get(id);
		chord_diagram.setoutputArray(chordObj.fingerIndex);
		$("#chordList li.currentEdit").removeClass("currentEdit");
		$(obj).parent("li").addClass("currentEdit");
		editTargetId = id;
		chord_diagram.parseNote();
		editMode();
	}

	o.update = function(){
		var outputArray = chord_diagram.getOutputArray();
		canvas_chord_diagram.setFingerIndex(outputArray);
		chord_collection.update(editTargetId , canvas_chord_diagram.getCanvas() , outputArray);
		$("#chordList li.currentEdit").find("canvas").remove();
		$("#chordList li.currentEdit").prepend(canvas_chord_diagram.getCanvas());
		editTargetId = null;
		$("#chordList li").removeClass("currentEdit");
		addMode();
	}

	o.delete = function(obj , id){
		chord_collection.delete(id);		
		$(obj).parent("li").detach();
		if(inputMode == 1){
			o.cancel();
		}
	}

	o.cancel = function(){
		chord_diagram.setoutputArray([0,0,0,0,0,0]);
		chord_diagram.parseNote();
		editTargetId = null;
		$("#chordList li").removeClass("currentEdit");
		addMode();
	}

	var editTargetId = null;
	var editMode = function(){
		inputMode = 1;
		$("#addButton").hide();
		$("#updateButton").show();
		$("#cancelButton").show();
	}

	var addMode = function(){
		inputMode = 0;
		$("#addButton").show();
		$("#updateButton").hide();
		$("#cancelButton").hide();
	}

	return o;

})(main || {});



window.initGoogleAPI	= function(){
	gapi.client.setApiKey('AIzaSyATKgocs2ylWRGBQiwrQIN_BEo4E6w2QGM');	
	main.shorturlCallback();
}
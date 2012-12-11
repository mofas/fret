
/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
(function($) {
  var o = $({});
  $.subscribe = function() {
    o.on.apply(o, arguments);
  };
  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };
  $.publish = function() {
    o.trigger.apply(o, arguments);
  };
}(jQuery));


$(function(){			
	main.init();
});


var main = (function(o){

	var fingerIndexMap = ["-","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"];
	var $chordDiagram,
	 	$chordList,
	 	$outputLinkWrap,
	 	$outputLink,
	 	$chordTitleInput,
	 	$suggestChordNameCollection,
		inputMode = 0,
		editTargetId = null;

	var queryChordNameTimer = null;

	var bindEvent = function(){
		$chordList = $("#chordList");
		$chordDiagram = $('.chord_diagramWrap');
		$outputLink = $("#outputLink");
		$suggestChordNameCollection = $("#suggestChordName");

		$suggestChordNameCollection.on("click" , "a" , function(){
			var name = $(this).text();
			$chordTitleInput.val(name);
			$suggestChordNameCollection.html('');
		});

		$chordList.on("click", ".chordItem" , function(){			
			$(this).siblings().removeClass("selected").end().addClass("selected");			
		});
		
		$("#addButton").on("click" , o.add);
		$("#updateButton").on("click" , o.update);
		$("#cancelButton").on("click" , o.cancel);
		$("#saveImageButton").on("click" , o.saveAsImage);
		$("#outputURLButton").on("click" , o.output);			
		$("#shorturl").on("mousedown" , o.shortUrlEvent);		
		$outputLinkWrap.find(".close").on("click" , hidenOutputEvent);
	}	

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

	var bindHideOutputEvent = function(){
		$chordDiagram.add($chordList).one("click" , hidenOutputEvent);
	}

	var hidenOutputEvent = function(){
		$chordList.off("click" , hidenOutputEvent);
		$chordDiagram.off("click" , hidenOutputEvent);		
		$outputLinkWrap.css({visibility: 'hidden'});
		$("#shorturl").attr('checked', false);
	}

	o.shortUrlEvent = function(){		
		if (!$(this).is(':checked')) {
	        $(this).trigger("change");	        
	        urlHandler.shortUrl();	        
	    }
	    else{	    	
	    	urlHandler.resetUrl();	    	
	    }	    
	}	

	o.init	=	function(){
		$outputLinkWrap = $(".outputLinkWrap");
		$outputLink = $("#outputLink");

		var $strings = $(".string"),
			$muteButtonWrap = $(".mutebuttonWrap"),	
			$loadingMsg = $outputLinkWrap.find(".loadingMsg");
		
		//chord_diagram.init($strings , $muteButtonWrap , chordDiagramChangeEvent);
		chord_diagram.init($strings , $muteButtonWrap);
		$.subscribe("chordDiagramModel/change" , chordDiagramChangeEvent);
		
		$chordTitleInput = $("#chordTitle");
		urlHandler.init($outputLink , $loadingMsg);
		urlHandler.parseNoteByURL();
		bindEvent();
	}	

	o.saveAsImage = function(){
		chord_collection.outputCollectionImage();
	}
	
	o.output = function(){		
		if($outputLinkWrap.css('visibility') == 'visible')
			return;		
		var url = urlHandler.output();
		$outputLinkWrap.css({visibility: 'visible'});
		bindHideOutputEvent();
		$outputLink.val(url).focus().select();
	}	

	o.add = function(){				
		var outputArray = chord_diagram.getOutputArray(),
			name = $chordTitleInput.val();
		o.addByArray(name , outputArray);
	}

	o.addByArray = function(name , outputArray){		
		canvas_chord_diagram.setFingerIndex(name , outputArray);
		var index = chord_collection.add(name , canvas_chord_diagram.getCanvas() , outputArray.slice()),
			buttonHtml = '<a class="button" href="javascript:;" onclick="javascript:main.edit(this , '+index+');" >編輯</a>'
							+'<a class="button delete" href="javascript:;" onclick="main.delete(this , '+index+');">刪除</a>',
			fragmentHtml = $('<li class="chordItem"></li>');

		fragmentHtml.append(canvas_chord_diagram.getCanvas());
		fragmentHtml.append($(buttonHtml));
		$("#chordList").append(fragmentHtml);
	}

	o.edit = function(obj , id){
		var chordObj = chord_collection.get(id);
		$chordTitleInput.val(chordObj.name);
		chord_diagram.setoutputArray(chordObj.fingerIndex);
		$("#chordList li.currentEdit").removeClass("currentEdit");
		$(obj).parent("li").addClass("currentEdit");
		editTargetId = id;
		chord_diagram.parseNote();
		editMode();
	}

	o.update = function(){
		var outputArray = chord_diagram.getOutputArray(),
			name = $chordTitleInput.val();
			
		canvas_chord_diagram.setFingerIndex(name , outputArray);
		chord_collection.update(editTargetId , name , canvas_chord_diagram.getCanvas() , outputArray);
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
		$chordTitleInput.val("");
		chord_diagram.parseNote();
		editTargetId = null;
		$("#chordList li").removeClass("currentEdit");
		addMode();
	}

	var chordDiagramChangeEvent = function(){		
		clearTimeout(queryChordNameTimer);
		queryChordNameTimer = setTimeout(o.queryChordName , 1000);
	}

	o.queryChordName = function(){
		var outputArray = chord_diagram.getOutputArray();		
		chordName.queryChordName(outputArray , o.queryChordNameComplete);			
	}

	o.queryChordNameComplete = function(suggestionName){
		$chordTitleInput.autocomplete({
            source: suggestionName
        });
		var htmlFragment = "";
		for(var i =0; i<suggestionName.length ; i++){
			htmlFragment += '<a href="#">' + suggestionName[i] + '</a>';
		}
		if(suggestionName.length ===0 ){
			htmlFragment = '<span class="no-result">資料庫尚無資料</span>'
		}
		$suggestChordNameCollection.html(htmlFragment);
	} 


	return o;

})(main || {});

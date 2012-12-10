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
		inputMode = 0,
		editTargetId = null;

	var bindEvent = function(){
		$chordList = $("#chordList");
		$chordDiagram = $('.chord_diagramWrap');
		$outputLink = $("#outputLink");
		$chordList.on("click", ".chordItem" , function(){			
			$(this).siblings().removeClass("selected").end().addClass("selected");			
		});

		$chordTitleInput.on("focus" , o.queryChordName );
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
		
		chord_diagram.init($strings , $muteButtonWrap);
		
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

	o.queryChordName = function(){
		var outputArray = chord_diagram.getOutputArray();		
		var suggestionName = chordName.queryChordName(outputArray);

		$chordTitleInput.autocomplete({
            source: suggestionName
        });
        
		/**
		var htmlFragment = "";
		for(var i =0; i<suggestionName.length ; i++){
			htmlFragment += '<a href="#">' + suggestionName[i] + '</a>';
		}
		$("#suggestChordName").html(htmlFragment);
		**/
	}


	return o;

})(main || {});

$(function(){			
	chord_diagram.init();
});


var chord_diagram = (function(o){

	var $strings;
	var $muteButtonWrap;
	var fingerIconFraHtml = '<div class="finger"></div>';

	var noteArray = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
	//var noteArray2 = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
	var openStringNoteIndex = [4,11,7,2,9,4];
	var outputArray = new Array(6);

	/**
	var getStringIndex = function(obj){
		return obj.find(".string").index(".string");		
	}
	**/

	var getNote = function(stringIndex , fretIndex){
		var initNote = (openStringNoteIndex[stringIndex] + fretIndex +1 ) % 12;		
		return noteArray[initNote];
	}

	var parseNote = function(){
		var param =  window.top.location.search.substring(1);
		var end = param.lastIndexOf("_") || param.indexOf("&") || param.length;		
		param = param.substring(param.indexOf("note=")+5 , end); 
		var noteMap;
		if(param.length > 0 )
			noteMap = param.split("_");		
		else
			noteMap = [0,0,0,0,0,0];
		for(var i = 0; i < 6 ; i++){
			var note = noteMap[i];			
			if(note < 0){				
				$muteButtonWrap.find(".muteButton").eq(i).trigger("click");				
			}
			else if(note == 0){								
				$(".noteArea .note").eq(i).html(getNote(i,-1));
			}
			else{
				$strings.eq(i).find(".fretWrap").eq(note-1).trigger("click");
				$(".noteArea .note").eq(i).html(getNote(i,note-1));
			}			
		}		
	}

	var setFingerEvent	=	function(){		
		$strings.on("click" , ".fretWrap" , function(){			
			var $this = $(this);
			var $sameString = $this.parent(".string");
			var stringIndex = $sameString.index('.string');
			var fretIndex = $(this).index();
			if($sameString.hasClass("hide")){				
				$sameString.removeClass("hide");				
			}						
			$muteButtonWrap.find(".muteButton").eq(stringIndex).addClass("disable");			
			var note = getNote(stringIndex , fretIndex-1);	
			$(".noteArea .note").eq(stringIndex).html(note);
			$sameString.find(".finger").hide();							
			$(this).find(".finger").show();
		});
	}


	var setFingerButtonEvent	=	function(){
		$strings.on("click" , ".finger" , function(e){			
			e.stopPropagation();
			e.preventDefault();						
			var index = $(this).parents(".string").index(".string");			
			$muteButtonWrap.find(".muteButton").eq(index).removeClass("disable");
			$(this).hide();		
			$(".noteArea .note").eq(index).html(getNote(index,-1));
		});
	}

	muteStringEvent = function(){		
   		$muteButtonWrap.on("click" , ".muteButton" , function(){
   			var index = $(this).index();   		
   			if($(this).hasClass('mute')){   				
   				$(this).removeClass('mute');
   				$strings.eq(index).removeClass("hide");
   				$(".noteArea .note").eq(index).html(getNote(index,-1));
   			}
   			else if($(this).hasClass('disable')){   	
   				$(this).removeClass('disable').addClass('mute');
   				$strings.eq(index).addClass("hide").find(".finger").hide();  
   				$(".noteArea .note").eq(index).html('');
   			}
   			else{   				
   				$(this).addClass('mute');
   				$strings.eq(index).addClass("hide");	   				
   				$(".noteArea .note").eq(index).html('');
   			}
   			
   		});
	}


	var getOutputArray = function(){
		$strings.each(function(index , obj){
			$string = $(obj);
			$button = $string.find(".finger:visible");
			var isMute = $muteButtonWrap.find(".muteButton").eq(index).hasClass("mute");			
			if($button.length > 0){								
				outputArray[index] = parseInt($button.index('.finger'))- 15*index + 1;
			}
			else{
				if(isMute){
					outputArray[index] = -1;
				}
				else{
					outputArray[index] = 0;
				}
			}
		});	

	}

	o.init	=	function(){
		$strings = $(".string");
		$muteButtonWrap = $(".mutebuttonWrap");   	
		bindEvent();
		parseNote();				
	}

	var bindEvent	=	function(){
		muteStringEvent();
		setFingerEvent();
		setFingerButtonEvent();		
	}	

	o.output = function(){		
		var outputString ="note=" , $string , $button , isMute;

		$strings.each(function(index , obj){
			$string = $(obj);
			$button = $string.find(".finger:visible");
			var isMute = $muteButtonWrap.find(".muteButton").eq(index).hasClass("mute");			
			if($button.length > 0){								
				outputString += (parseInt($button.index('.finger'))- 15*index + 1) + "_";
			}
			else{
				if(isMute){
					outputString += "-1_" ;
				}
				else{
					outputString += "0_";
				}
			}
		});	

		var urlEnd = (window.location.href.lastIndexOf("?") > 0) ? window.location.href.lastIndexOf("?") : window.location.href.length;
		var url = window.location.href.substring( 0 , urlEnd ) + "?" + outputString;		
		var link = '<a traget="_blank" href="'+url+'">'+url+'</a>';
		$("#outputLink").html(link);
	}

	o.saveAsImage = function(){
		getOutputArray();
		console.log(outputArray);
		canvas_chord_diagram.setFingerIndex(outputArray);
		canvas_chord_diagram.saveAsImage();
	}

	return o;

})(chord_diagram || {});
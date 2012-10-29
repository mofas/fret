$(function(){			
	main.init();
});


var main = (function(o){

	var fingerIndexMap = ["-","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"];

	var parseNoteByURL = function(){		
		var param =  window.location.href.split("?")[1];
		//chord collection

		if(param === undefined)
			return;
		
		var collection = param.split("&c=").slice(1);
		var strArray;
		for(var i =0; i < collection.length ;i++){
			strArray = collection[i].split("");
			var intArray = new Array(6);
			for(var j=0;j < strArray.length;j++){
				intArray[j] = isNaN(parseInt(strArray[j] , 10)) ? -1 : parseInt(strArray[j] , 10);
			}			
			chord_diagram.setoutputArray(intArray);
			add(intArray);
		}
		
		var noteInfo = param.substring(param.indexOf("note=")+5 , param.indexOf("note=")+11);
		var tempArray = new Array(6);
		if(noteInfo.length > 0 ){						
			var fingerIndexString = fingerIndexMap.join("");
			var rawArray = noteInfo.split("");
			for(var i = 0 ; i < rawArray.length ; i++){
				tempArray[i] = fingerIndexString.indexOf(rawArray[i])-1;
			}
			chord_diagram.setoutputArray(tempArray);
		}
		else{
			chord_diagram.setoutputArray([0,0,0,0,0,0]);
		}
		
		chord_diagram.parseNote();
	}


	o.init	=	function(){
		var $strings = $(".string");
		var $muteButtonWrap = $(".mutebuttonWrap");
		chord_diagram.init($strings , $muteButtonWrap);
		parseNoteByURL();
	}

	o.saveAsImage = function(){
		chord_diagram.getOutputArray();		
		canvas_chord_diagram.setFingerIndex(outputArray);
		canvas_chord_diagram.saveAsImage();
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
		var link = '<a traget="_blank" href="'+url+'">'+url+'</a>';
		$("#outputLink").html(link);		
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
		$("#addButton").hide();
		$("#updateButton").show();
		$("#cancelButton").show();
	}

	var addMode = function(){
		$("#addButton").show();
		$("#updateButton").hide();
		$("#cancelButton").hide();
	}

	return o;

})(main || {});
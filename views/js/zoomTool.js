

$(document).ready(function() {
	zoomTool.init();
});




var zoomTool =(function(o){	

	var $zoomInButton , $zoomOutButton , $zoomTarget,
		zoomScale = 1.00;

	o.init = function(){
		$zoomOutButton = $("#zoomOut");
		$zoomInButton = $("#zoomIn");
		$zoomTarget = $(".zoomTarget");
		bindEvent();
	}

	var bindEvent = function(){
		$zoomOutButton.on("click" , zoomOut);
		$zoomInButton.on("click" , zoomIn);
	}

	var zoomIn = function(){
		zoomScale += 0.2;
		$zoomTarget.css({ zoom : zoomScale});
	}

	var zoomOut = function(){
		if(zoomScale > 1){
			zoomScale -= 0.2;
			$zoomTarget.css({ zoom : zoomScale});
		}			
	}


	return o;

})(zoomTool || {});

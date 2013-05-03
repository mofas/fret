$(document).ready(function() {
	rhythmEditor.init();
});

var rhythmEditor = (function(o){
	"use strict";


	var 
		$el,
		$muteBtns,
		$shredBars,
		$rhythmBar;

	var rhythm = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


	o.init = function(){
		DOMCache();
		bindEvent();
		initOnce();
	}

	var DOMCache = function(){
		$el = $("#rhythmEditor");
		$muteBtns = $el.find(".muteBtnList li");
		$shredBars = $el.find(".shredBarList li");
		$rhythmBar = $el.find(".rhythmBar li");
	}

	var bindEvent = function(){
		$muteBtns.on("click" , function(){
			var $this = $(this),
				index = $this.index();
			$this.toggleClass("selected");

			if(rhythm[index] !== -1){
				rhythm[index] = -1;
				$shredBars.eq(index).removeClass("selected");
			}
			else{
				rhythm[index] = 0;	
			}
			refreshRhythmBar();
		});
		$shredBars.on("click" , function(){
			var $this = $(this),
				index = $this.index();
			$this.toggleClass("selected");

			if(rhythm[index] !== 1){
				$muteBtns.eq(index).removeClass("selected");
				rhythm[index] = 1;
			}
			else{
				rhythm[index] = 0;	
			}
			refreshRhythmBar();
		});
	}

	var refreshRhythmBar = function(){
		//console.log(rhythm);
		//check very 2 bit
		for(var i = 0 ; i < 8 ; i++){
			if(rhythm[i*2] === 0){
				if(rhythm[i*2+1] === 0){
					//check previous 2
					$rhythmBar.eq(i*2).removeClass("mute active").addClass("single");
					$rhythmBar.eq(i*2+1).removeClass("mute active").addClass("single");
				}
				else if(rhythm[i*2+1] === 1){
					$rhythmBar.eq(i*2).removeClass("mute double").addClass("single active");
					$rhythmBar.eq(i*2+1).removeClass("mute double").addClass("double active");
				}
				else if(rhythm[i*2+1] === -1){
					$rhythmBar.eq(i*2).removeClass("mute active").addClass("single");
					$rhythmBar.eq(i*2+1).removeClass("active").addClass("mute");
				}
				else{
					throw new TypeError('Invalid rhythm');
				}
			}
			else if(rhythm[i*2] === 1){
				if(rhythm[i*2+1] === 0){
					$rhythmBar.eq(i*2).removeClass("mute double").addClass("single active");
					$rhythmBar.eq(i*2+1).removeClass("mute double").addClass("single active");
				}
				else if(rhythm[i*2+1] === 1){
					$rhythmBar.eq(i*2).removeClass("mute single").addClass("double active");
					$rhythmBar.eq(i*2+1).removeClass("mute single").addClass("double active");
				}
				else if(rhythm[i*2+1] === -1){
					$rhythmBar.eq(i*2).removeClass("mute double").addClass("double active");
					$rhythmBar.eq(i*2+1).removeClass("active").addClass("mute");
				}
				else{
					throw new TypeError('Invalid rhythm');
				}
			}
			else if(rhythm[i*2] === -1){
				if(rhythm[i*2+1] === 0){
					$rhythmBar.eq(i*2).removeClass("active").addClass("mute");
					$rhythmBar.eq(i*2+1).removeClass("active").addClass("mute");
				}
				else if(rhythm[i*2+1] === 1){
					$rhythmBar.eq(i*2).removeClass("active").addClass("mute");
					$rhythmBar.eq(i*2+1).removeClass("mute single").addClass("double active");
				}
				else if(rhythm[i*2+1] === -1){
					$rhythmBar.eq(i*2).removeClass("active").addClass("mute");
					$rhythmBar.eq(i*2+1).removeClass("active").addClass("mute");
				}
				else{
					throw new TypeError('Invalid rhythm');
				}
			}
			else{
				throw new TypeError('Invalid rhythm');
			}
		}
	}

	var initOnce = function(){		

	}

	return o;

})( rhythmEditor || {} );
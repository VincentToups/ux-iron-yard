document.addEventListener("DOMContentLoaded",function(){
    var canvas = document.querySelector("#main-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext('2d');
    if(window.init){
	window.init(context, width, height);
    }
    function loop(){
	if(window.drawFrame){
	    window.drawFrame(context, width, height);
	}
	requestAnimationFrame(loop);
    }
    loop();
});

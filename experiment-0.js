(function(){
    var points = undefined;
    var previousPoints = undefined;
    var currentRow = 0;
    var rules = {
	'111':0,
	'110':1,
	'101':1,
	'100':0,
	'011':1,
	'010':1,
	'001':1,
	'000':0
    };

    function mutateRules(rules){
	var keys = Object.keys(rules);
	var output = {};
	keys.forEach(function(k){
	    output[k] = rules[k];
	});
	var twiddle = selectOne(keys);
	output[twiddle] = rules[twiddle] === 1 ? 0 : 1;
	return output;
    }

    function mutatePoints(points){
	var out = [];
	for(var i = 0; i < points.length; i++){
	    if(Math.random()<0.1){
		out[i] = points[i] === 0 ? 1 : 0;
	    } else {
		out[i] = points[i];
	    }
	}
	return out;
    }
    
    function previousConfig(array,i){
	var iprev = (i-1 + array.length) % array.length;
	var inext = (i+1 + array.length) % array.length;
	var config = [array[iprev],array[i],array[inext]].join('');
	return config;
    }
    function drawRow(context,width,height,row,array){
	row = row % height;
	for(var i = 0; i < array.length; i ++){
	    context.fillStyle = array[i] === 0 ? "black" : "white";
	    context.fillRect(i,row,1,1);
	}
    }
    function calculateNewState(oldstate, rules){
	var newstate = new Array(oldstate.length);
	for(var i = 0; i < oldstate.length; i ++){
	    newstate[i] = rules[previousConfig(oldstate,i)];
	}
	return newstate;
    }
    window.init = function(context, width, height){
	points = new Array(width);
	for(var i = 0; i < width;i = i + 1){
	    points[i] = Math.random()<0.5 ? 1 : 0;
	};
    };    
    window.drawFrame = function(context,width,height){
	drawRow(context,width,height,currentRow,points);
	points = calculateNewState(points,rules);
	if(Math.random()<0.1) rules = mutateRules(rules);
	if(Math.random()<0.1) points = mutatePoints(points);
	currentRow = currentRow + 1;	
    };
})();

//| current pattern           | 111 | 110 | 101 | 100 | 011 | 010 | 001 | 000 |
//| new state for center cell |   0 |   1 |   1 |   0 |   1 |   1 |   1 |   0 |

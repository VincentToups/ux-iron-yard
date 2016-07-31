(function(){
    var points = undefined;
    var previousPoints = undefined;
    var currentRow = 0;
    var rules = {
	'01110':0,
	'01100':1,
	'01010':1,
	'01000':0,
	'00110':1,
	'00100':1,
	'00010':1,
	'00000':0,

	'11110':0,
	'11100':1,
	'11010':1,
	'11000':0,
	'10110':1,
	'10100':1,
	'10010':1,
	'10000':0,

	'11111':0,
	'11101':1,
	'11011':1,
	'11001':0,
	'10111':1,
	'10101':1,
	'10011':1,
	'10001':0,

	'01111':0,
	'01101':1,
	'01011':1,
	'01001':0,
	'00111':1,
	'00101':1,
	'00011':1,
	'00001':0,
	
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
	var iprevprev = (i-2 + array.length) % array.length;
	var iprev = (i-1 + array.length) % array.length;
	var inext = (i+1 + array.length) % array.length;
	var inextnext = (i+2 + array.length) % array.length;
	var config = [array[iprevprev],array[iprev],array[i],array[inext],array[inextnext]].join('');
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

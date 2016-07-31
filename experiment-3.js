(function(){

    function toBinaryString(num, places) {
	var ns = num.toString(2);
	var zero = places - ns.length + 1;
	return Array(+(zero > 0 && zero)).join("0") + ns;
    }
    
    function enumerateConfigurations(n){
	var max = Math.pow(2,n);
	var out = [];
	for(var i = 0; i < max; i ++){
	    out.push(toBinaryString(i,n));
	}
	return out;
    }

    function initializeRules(n){
	var keys = enumerateConfigurations(n);
	var out = {};
	keys.forEach(function(key){
	    out[key] = Math.round(Math.random()*0.6);
	});
	return out;
    }
    
    var points = undefined;
    var previousPoints = undefined;
    var currentRow = 0;
    var rules = initializeRules(5);

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

    function getRulesWidth(rules){
	return (Object.keys(rules)[0]).length;
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

    function zeroPoints(points){
	var out = [];
	for(var i = 0; i < points.length; i++){
	    out[i] = 0;
	}
	return out;
    }

    function reinitPoints(points){
	var out = zeroPoints(points);
	out[Math.round(points.length/2)] = 1;
	return out;
    }
    
    function previousConfig(array,i,width){
	var out = [];
	var halfW = Math.floor(width/2);
	var arrayLength = array.length;
	var final = i+halfW;
	for(var j=i-halfW; j<=final; j++){
	    out.push(array[(j+arrayLength)%arrayLength]);
	}
	return out.join('');
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
	    newstate[i] = rules[previousConfig(oldstate,i,getRulesWidth(rules))];
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
	if(currentRow===0) rules = mutateRules(rules);
	if(currentRow===0) points = reinitPoints(points);
	drawRow(context,width,height,currentRow,points);
	points = calculateNewState(points,rules);
	currentRow = (currentRow + 1)%height;
    };
})();

//| current pattern           | 111 | 110 | 101 | 100 | 011 | 010 | 001 | 000 |
//| new state for center cell |   0 |   1 |   1 |   0 |   1 |   1 |   1 |   0 |

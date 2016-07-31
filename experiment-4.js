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

    function Rules(symbols,width,randomize,mode){
	mode = typeof mode === "undefined" ? "direct" : mode;
	this.symbols = symbols;
	this.transitions = {};
	var keys = Array.prototype.slice.call(symbols,0,symbols.length);
	var symbolsArray = Array.prototype.slice.call(symbols,0,symbols.length);
	this.symbolsArray = symbolsArray;
	for(var i = 0; i < width-1 ; i++){
	    var newKeys = [];
	    keys.forEach(function(k){
		symbolsArray.forEach(function(s){
		    newKeys.push(k+s);
		});
	    });
	    keys = newKeys;
	}

	var upDowns = [-1,1];
	var mixedVals = [].concat(symbolsArray,upDowns);
	this.mutateVals = mode === "direct" ?
	    symbolsArray
	    : mode === "upDown" || mode === "upDownCyclical" ?
	    upDowns
	    : mode === "mixed" ?
	    mixedVals : symbolsArray;
	keys.forEach((function(k){
	    this.transitions[k] = (Math.random() < randomize*1) ? selectOne(this.mutateVals)
	    : symbolsArray[0];
	}).bind(this));

	this.width = width;
	this.keys = keys;
	this.mode = mode;
    }

    Rules.prototype.getSymbolCount = function(){
	return this.symbolsArray.length;
    };

    Rules.prototype.mutate = function(){
	var key = selectOne(this.keys);
	this.transitions[key] = selectOne(this.mutateVals);
    };

    Rules.prototype.updateState = function(state){
	var n = state.length;
	var newState = new Array(n);
	var start = Math.floor(this.width/2);
	for(var i = 0; i < n; i++){
	    var key = [];
	    for(var j = i-start; j<=i+start; j++){
		key.push(state[(j+n)%n]);
	    }
	    var transition = this.transitions[key.join('')];
	    if(typeof transition === "number"){
		var oldI = this.symbolsArray.indexOf(state[i]);
		var newI = oldI+transition;
		if(this.mode === "upDownCyclical"){
		    newState[i] = this.symbolsArray[(newI+this.symbolsArray.length)%this.symbolsArray.length];
		} else {
		    if(newI<0) newI = 0;
		    if(newI>=this.symbolsArray.length) newI = this.symbolsArray.length - 1;
		    newState[i] = this.symbolsArray[newI];
		}
	    } else {
		newState[i] = this.transitions[key.join('')];
	    }
	    
	}
	return newState;
    };

    Rules.prototype.createState = function(n,randomize){
	var a = new Array(n);
	for(var i = 0; i < n; i++){
	    a[i] = randomize ? selectOne(this.symbolsArray) : this.symbolsArray[0];
	}
	return a;
    };
    
    var points = undefined;
    var currentRow = 0;
    var rules = new Rules("abcde",3,0.4,"direct");
    // var colors = {
    // 	a:"#DFABEF",
    // 	b:"#C3F0AD",
    // 	c:"#1D4D05"
    // };
    var colorsList = interpolateColors("#DFABEF","#1D4D05",rules.getSymbolCount());
    //var colorsList = interpolateColors("white","black",rules.getSymbolCount());
    colors = {};
    colorsList.forEach(function(c,i){
	colors[rules.symbolsArray[i]] = c;
    });
    

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
    
    function drawRow(context,width,height,row,array){
	row = row % height;
	for(var i = 0; i < array.length; i ++){
	    context.fillStyle = colors[array[i]];
	    context.fillRect(i,row,1,1);
	}
    }
    
    window.init = function(context, width, height){
	points = rules.createState(width,true);
    };    
    window.drawFrame = function(context,width,height){
	if(currentRow===0) rules.mutate();
	if(currentRow===0) {
	    points = rules.createState(width);
	    rules.symbolsArray.forEach(function(s,i){
	    	points[Math.floor(points.length*i/rules.symbolsArray.length)] = s;
	    });
	}
	drawRow(context,width,height,currentRow,points);
	points = rules.updateState(points);
	currentRow = (currentRow + 1)%height;
    };
})();

//| current pattern           | 111 | 110 | 101 | 100 | 011 | 010 | 001 | 000 |
//| new state for center cell |   0 |   1 |   1 |   0 |   1 |   1 |   1 |   0 |

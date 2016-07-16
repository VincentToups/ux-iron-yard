function unitFromTo(v1,v2){
    var d = [v1[0]-v2[0],v1[1]-v2[1]];
    var l = Math.sqrt(d[0]*d[0]+d[1]*d[1]);
    d[0] = d[0]/l;
    d[1] = d[1]/l;
    return l === 0 ? [0,0] : d;
}

function directionAndDistance(v1,v2){
    var d = [v1[0]-v2[0],v1[1]-v2[1]];
    var l = Math.sqrt(d[0]*d[0]+d[1]*d[1]);
    d[0] = d[0]/l;
    d[1] = d[1]/l;
    return l === 0 ? {d:[0,0],v:[0,0]} : {d:l, v:d};
}

function gravitationalForce(v1,v2,c){
    var d = [v1[0]-v2[0],v1[1]-v2[1]];
    var l = Math.sqrt(d[0]*d[0]+d[1]*d[1]);
    var lSmall  = l<5;
    l = lSmall ? 5 : l;
    d[1] = d[1]/l;
    return lSmall ? vtimes(d,c/(l*l)) : vtimes(d,-c/(l*l));
}


function fromToDistance(v1,v2){
    var d = [v1[0]-v2[0],v1[1]-v2[1]];
    var l = Math.sqrt(d[0]*d[0]+d[1]*d[1]);
    return l;
}

function rk4(x,dx,dt,t,plus,times){
    var x1 = x;
    var a1 = dx(x1,0,t);

    var x2 = plus(x, times(a1,0.5*dt));
    var a2 = dx(x2,dt/2,t+dt/2);

    var x3 = plus(x, times(a2,0.5*dt));
    var a3 = dx(x3,dt/2,t+dt/2);

    var x4 = plus(x, times(a3,dt));
    var a4 = dx(x4,dt,t+dt);

    return plus(x, times(plus(a1,times(a2,2),times(a3,2),a4),dt/6));
}

function vtimes(v,c){
    var n = v.length;
    var o = new Array(n);
    for(var i=0;i<n;i++){
	o[i] = v[i]*c;
    }
    return o;
}

function vplus(){
    var n = arguments.length;
    var vectors = Array.prototype.slice.call(arguments, 0, n);
    var d = vectors[0].length;
    var o = new Array(d);
    for(var i = 0; i < d; i++){
	o[i] = 0;
	for(var j = 0; j < n; j++){
	    o[i] = vectors[j][i]+o[i];
	}
    }
    return o;
}

function vrk4(x,dx,dt,t){
    return rk4(x,dx,dt,t,vplus,vtimes);
}

function fallingdx(x,dt,t){
    var nParticles = x.length/4;
    var o = new Array(x.length);
    for(var i = 0; i < nParticles; i ++){
	o[i*4] = x[i*4+2]*dt;
	o[i*4+1] = x[i*4+3]*dt;
	o[i*4+2] = 0;
	o[i*4+3] = 0;
	for(var j = 0; j < nParticles; j = j + 1){
	    if(i!==j){
		var gf = gravitationalForce(x.slice(i*4,i*4+2),
					    x.slice(j*4,j*4+2),3000000);
		o[i*4+2] += gf[0];
		o[i*4+3] += gf[1];		
	    }
	}
    }
    return o;
}

function makePoints(n,positions){
    var o = new Array(n*4);
    for(var i=0; i < n*4; i = i + 1){
	o[i] = 0;
    }
    if(positions){
	positions.forEach(function(p,i){
	    o[i*4] = p[0];
	    o[i*4+1] = p[1];
	});
    }    
    return o;
}

function drawPoints(points, context,width,height,colors){
    var n = points.length/4;
    for(var i = 0; i < n; i++){
	context.save();
	context.beginPath();
	context.arc(points[i*4],points[i*4+1],20,0,Math.PI*2);
	context.fillStyle = colors[i%colors.length];
	context.fill();
	context.restore();
    }
};

function drawLines(points, previousPoints, context,width,height,colors){
    var n = points.length/4;
    for(var i = 0; i < n; i++){
	context.save();
	context.beginPath();
	context.moveTo(previousPoints[i*4],previousPoints[i*4+1]);
	context.lineTo(points[i*4],points[i*4+1]);
	context.strokeStyle = colors[i%colors.length];
	context.stroke();
	context.restore();
    }
}

function fixPositions(points, previousPoints, width,height){
    var n = points.length/4;
    for(var i = 0; i < n; i++){
	var x = points[i*4];
	var y = points[i*4+1];
	var xc = (x+width) % width;
	var yc = (y+height) % height;
	if(Math.abs(x-xc)>100){
	    points[i*4] = xc;
	    previousPoints[i*4] = xc;
	};

	if(Math.abs(y-yc)>100){
	    points[i*4+1] = yc;
	    previousPoints[i*4+1] = yc;
	};	
    }
    return points;
}

function buildInitialPs(n,width,height){
    var o = [];
    var r = (width<height ? width : height)*0.3;
    var pi2 = Math.PI*2;
    var cx = width/2;
    var cy = height/2;
    for(var i = 0; i < n; i = i + 1){
	o.push([cx+r*Math.cos((i/n)*pi2),
		cy+r*Math.sin((i/n)*pi2)]);
    }
    return o;
}

function greys(n){
    var o = [];
    for(var i = 0 ; i < n ; i = i + 1){
	o.push(grey(Math.floor(255*(i/n))));
    }
    return o;
}

(function(){
    var points = undefined;
    var previousPoints = undefined;
    var nPoints = 107;
    var colors = greys(nPoints);
    window.init = function(context,width,height){
	var initPs = buildInitialPs(nPoints,width,height);
	points = makePoints(nPoints,initPs);
	previousPoints = makePoints(nPoints,initPs);
    };
    window.drawFrame = function(context,width,height){
	previousPoints = points;
	points = vrk4(points,fallingdx,3/1000,0);
	//fixPositions(points,previousPoints,width,height);
	drawLines(points,previousPoints,context,width,height,colors);
    };
})();




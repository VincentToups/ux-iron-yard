function selectOne(a, ifEmpty){
    var l = a.length;
    if(l===0){
	return ifEmpty;
    } else {
	return a[Math.floor(Math.random()*l)];
    }
}

function r255(){
    return Math.floor(255*Math.random());
}

function randomColor(){
    return tinycolor({r:r255(),g:r255(),b:r255()}).toRgbString();
}

function randomNiceColor(){
    return tinycolor({r:r255(),g:r255(),b:r255()}).desaturate(45).toRgbString();
}

function randomGrey(){
    var g = r255();
    return tinycolor({r:g,g:g,b:g}).toRgbString();
}

function grey(v){
    var g = v;
    return tinycolor({r:g,g:g,b:g}).toRgbString();
}

function trim(s){
    return s.trim();
}

function notEmpty(s){
    return !(s.length===0);
}

function parseCaRules(s){
    var parts = s.split(new RegExp("[ ,]","g"))
	    .map(trim)
	    .filter(notEmpty);
    var rules = {};
    parts.forEach(function(part){
	var subparts = part.split("->").map(trim).filter(notEmpty);
	rules[subparts[0]] = 1*subparts[1];
    });
    return rules;
}

function interpolateColors(c1,c2,n){
    var out = [];
    c1 = tinycolor(c1).toRgb();
    c2 = tinycolor(c2).toRgb();
    for(var i = 0; i < n; i ++){
	out.push(tinycolor({
	    r:Math.floor((c1.r*(1-i/(n-1))+c2.r*(i/(n-1)))/1),
	    g:Math.floor((c1.g*(1-i/(n-1))+c2.g*(i/(n-1)))/1),
	    b:Math.floor((c1.b*(1-i/(n-1))+c2.b*(i/(n-1)))/1)
	}).toRgbString());
    }
    return out;    
}




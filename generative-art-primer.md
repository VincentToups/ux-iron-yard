Lesson 1 - 1D Cellular Automata
===============================

Today we will be focusing on one aspect of generative art: using
computers to visualize systems of rules applied over and over
again. I want to plug a paper here:

"The Unreasonable Effectiveness of Mathematics in the Physical
Sciences." - Eugine Wigner. 

For some reason the following is true about the universe: it obeys
rules which can be expressed mathematically. Physics, if you think
about it, is just the process of identifying those rules so that we
can ask: if the universe is in one state at time t, what state will it
be in a little bit later, at time t+dt. The shocking thing is that we
can find such rules and that they are simple!

![Jupiter](https://vincenttoups.github.io/ux-iron-yard/jupiter-approach.gif)

(The standard model of particle physics, for instance, is just about a
page and half of equations, but it predicts essentially everything
predictable about the time-evolution of physical systems.) All the
beauty and strangeness of life comes from these simple rules.

A Model of A Model
==================

Still, a half a page of equations expressed in terms of
not-so-elementary mathematics is not the best place to start. So we
will be experimenting today with a much simpler system which,
nevertheless, demonstrates a lot of the character of the universe:
from simple rules complex behavior arises.

![CA](https://vincenttoups.github.io/ux-iron-yard/ElementaryCARule030_700.gif)

Here is today's goal:
[Nothing We Haven't Seen Before](https://vincenttoups.github.io/ux-iron-yard/).

Believe it or not, this piece is based on a very simple idea:

We have a universe which is just a list of values, "on" or "off" (we
will represent these with 0, 1)

Universe: "001001010010011101011"

We want to define a rule which "updates" the universe. We'll do this
by sliding along the universe and updating each cell one at a time
based on the values currently in that cell and its two neighbors. For
each such triplet of values, we need to define a final value (there
are only two to choose from).

Here is a set of rules:

000 -> 1
100 -> 1
110 -> 0
111 -> 0
101 -> 1
011 -> 0
001 -> 0

On boundaries we will wrap around the universe. So the first triple
for the above universe would be 100, so the new state would be 1.

Thems the ideas! No to implementation!

The HTML Page!
==============

We'll be using a _canvas_ element to draw our artwork. A canvas is
just a special HTML element which we can draw whatever we want inside.

Our HTML should look like this:

	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="utf-8">
			<title>Nothing We Haven't Seen Before</title>
		<link rel="stylesheet" type="text/css" href="style.css">
		<script src="./tinycolor-min.js"></script>
		<script src="./utilities.js"></script>
		<script src="./experiment-2.js"></script>
		<script src="./make-things-go.js"></script>
		</head>
		<body>
		  <canvas id="main-canvas"></canvas>
		</body>
	</html>

(this is in the file `index.html`)

The body:

		<body>
		  <canvas id="main-canvas"></canvas>
		</body>

Just contains one element: a canvas. We want that canvas to occupy the
entire browser pane, so we use css to make that happen:

	html, body {
	  width:  100%;
	  height: 100%;
	  margin: 0px;
	}

Now if we open up this file, we'll get a blank page. 

Making things go:
=================

Don't worry too much about these details. When you work on generative
art you want to focus on the creative process, and let the technical
details just sort of hang out with you. But here is how everything is
going to go:

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


The basic idea here is simple: tell the browser to execute some code
after the HTML page is loaded. That code grabs the canvas, sets is
width and height (for drawing) so that it matches its dimensions, then
checks whether the window object has an `init` and `drawFrame`
method. It calls the `init` once, then asks the browser to call `loop`
every time the browser wants to update. `loop`, in turn, calls `drawFrame`.

The Big Picture
===============

Here is what we are going to do, in words: create a "world" of cells,
either zero or one, initialized randomly. We want the world to have
the same number of cells as the width of the image. We will then
update the world repeatedly according to the rules and draw the world
line by line, down the page. When we reach the bottom, we will start
drawing again at the top of the page, forever.

Because this gets boring, we will, from time to time, randomly modify
the rules and the points.

`init` and `drawFrame`
======================

These are defined in `experiment-0.js`:

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
    })

Understanding Unfamiliar Code
=============================

1. Always start with the "entry point" and go out from there.
2. Remember that Javascript just evaluates code step by step: there is
   never any mystery if you know the rules.
3. Use your browser's debugger!

Entry:
======

	window.drawFrame = function(context,width,height){
	    drawRow(context,width,height,currentRow,points);
	    points = calculateNewState(points,rules);
	    if(Math.random()<0.1) rules = mutateRules(rules);
	    if(Math.random()<0.1) points = mutatePoints(points);
	    currentRow = currentRow + 1;	
	};

Just five lines! The first draws the row, apparently using the
arguments to `drawFrame` and the variables `currentRow` and `points`.

Now we spiral out. First of all, what are `currentRow` and `points`?

They are defined up here:

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

And initialized in `init`:

    window.init = function(context, width, height){
	  points = new Array(width);
	  for(var i = 0; i < width;i = i + 1){
	    points[i] = Math.random()<0.5 ? 1 : 0;
	  };
    };
	
Finally, we draw the row:

    function drawRow(context,width,height,row,array){
        row = row % height;
        for(var i = 0; i < array.length; i ++){
          context.fillStyle = array[i] === 0 ? "black" : "white";
          context.fillRect(i,row,1,1);
        }
    }
	
In words, we calculate the row to draw our points on, and then draw
them as a series of 1x1 rectangles, using for loop.

On Graphics Contexts:
=====================

This `context` we are getting, initialized in `make-things-go.js` is
an object provided by the web browser which exposes methods we can use
to draw things onto the canvas. We use two aspects of the context
above, `fillStyle`, and `fillRect`. Note well that `fillStyle` is a
_value_ containing the color we want to draw while `fillRect` is a
method which fills a rectangle on the canvas.

You can find all the documentation on graphics contexts at the Mozzila Developer's Network page [here](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

Updating our system:
====================

	    points = calculateNewState(points,rules);
		
`calculateNewState` looks like: 

    function calculateNewState(oldstate, rules){
        var newstate = new Array(oldstate.length);
        for(var i = 0; i < oldstate.length; i ++){
        newstate[i] = rules[previousConfig(oldstate,i)];
        }
        return newstate;
    }
	
And the only complicated thing about this is `previousConfig`, a
function which takes an index into the array and returns a string
representing the previous, three-cell configuration needed to update
that cell.

    function previousConfig(array,i){
        var iprev = (i-1 + array.length) % array.length;
        var inext = (i+1 + array.length) % array.length;
        var config = [array[iprev],array[i],array[inext]].join('');
        return config;
    }
	
Aesthetics!
===========

We are just drawing cells as either black or white depending on
whether the cell is 0, or 1. But we can now experiment with different
drawing strategies to see whether we get anything interesting.

I'd like to live-code some of this at this point, take suggestions
from the class, etc.

Let's program in Javascript!
============================

Javascript is a programming language which runs inside almost every
web browser. It was originally intended as a way to allow web site
authors to add interactive elements to web sites and that use case has
flourished: the web browser has become, essentially, the user
interface for all application development.

Programming Language?
=====================

Programming languages are tools which allow the programmer to describe
some computation. A good way to start thinking about programming is
that the programmer writes a series of steps which the computer then
carries out.

For instance:

    var r = 10;
	var theta = Math.PI/2;
    var x = r*Math.cos(theta);
	var y = r*Math.sin(theta);
	console.log("The position of a point at r = 10, theta = pi/2 is ", x,y);
	
In order to understand programs we have to learn to do what the
browser does: we need t learn to evaluate expressions sequentially
until we have a result. In the above example we have five lines which
we execute sequentialy. The first four introduce "variables" which are
names for values, the final line prints out the values bound in the
variables x and y, along with a "string," which is how we describe a
lump of text.

Rules for Evaluation
====================

(Hint: you can right click on your browser, select "inspect element"
and then click the "Console" tab to open an interpreter for
Javascript: you can run little pieces of code there).

The first and most important rule is: break your program up into
pieces and evaluate the pieces first. Consider the program:

    var x = 10;
	var y = 11;
	console.log(x+y);
	
We can break it up into pieces, first line by line. So the first line is:

    var x = 10;
	
And this can be broken up further:

    |var x = |10||
	
Here I am breaking up the expression into pieces with `|`. Now we
evaluate the program starting with the inner most pieces:

Here is the confusing part: we have to distinguish `10` and "10". That
is, the program denoting the value `10`, which is a piece of text, and
the value of that program after evaluation, which is a representation
of the number 10. There are like a million confusing things about that
sentence, so lets stop here and really think about it.

The key thing is that computers represent different things in
different ways. Numbers in particular can be represented in such a way
that it is very efficient to calculate things with them. So when you
type `10` into your Javascript interpreter, even though it starts out
as the characters `1` and then `0`, the engine _evaluates_ that
textual representation into that efficient numerical representation so
that you can quickly calculate things like `Math.sqrt(10)`. Whenever
we type something which evaluates to a representation of the thing
itself, we call that thing an _literal_ value, as in "`10` is literally
the value 10".

So we break up the expression: 
	
    |var x = |10||
	
And we start with the inner-most expression `10` which we know the
machine will turn int a number. Then Javascript _binds_ that number to
the _name_ or _variable_ `x`. 

What does `binding` mean? It means that if Javascript encounters the
symbol `x` at a future point, it will look up the value in a big
dictionary somewhere and return `10`. Variable binding is really
important since almost every expression involves variables. The rules
are relatively simple:

If you see a variable, look in the enclosing contexts until you find
its value. The largest context is called the _top level_ and it is the
context we interact with at the interpreter. But we can introduce new
contexts in Javascript by introducing functions.

But first, the literals:

    var literalNumber = 10;
	var literalString = "Hello";
	var literalArray = [10,11,12,"Doggo"];
	var literalFunction = function(x,y,z){
	    // in here we have a new context.
		return x+y+z;
	}
	
Note that `//` indicates a comment. Javascript ignores anything on a
line after a `//`.

Functions
=========

Ok - what the heck is a function? It is just a re-usable block of code
which takes values in at one end and returns a value at the
other. Remember our code to calculate the x,y position of a point
located at a particular radius and angle?

Here it was:

    var r = 10;
	var theta = Math.PI/2;
    var x = r*Math.cos(theta);
	var y = r*Math.sin(theta);
	console.log("The position of a point at r = 10, theta = pi/2 is ", x,y);

We want to write a function to return the x,y coordinates given r and
theta.

    function toXY(r,theta){
		var x = r*Math.cos(theta);
		var y = r*Math.sin(theta);
		return [x,y]; // A literal array with variable elements.
	}
	
	> toXY(1,Math.PI/2)
	[ 6.123233995736766e-17, 1 ]
	> toXY(1,Math.PI/4)
	[ 0.7071067811865476, 0.7071067811865475 ]
	> 
	
Note that there is a difference between `toXY` and `toXY(1,0)`. The
first means "look up the value of the variable `toXY`, which happens
to be a function, but don't _call_ the function." When we put
parentheses after a function name we are telling Javascript "look up
the value of the variable `toXY` and then make sure it is a function
and then _call it_." The effect of calling the function is to bind the
values to the arguments, evaluate the body until a `return` statement,
and the return that value to the calling context. Remember:
_mentioning_ a function results in a function as a value. Calling a
function results in whatever the function _calculates_.

Control Flow
============

Computer programs gotta do different things based on input. For
instance, if you type a date in correctly, the browser needs to send
off to the server to make an appointment. But if you type it in wrong,
it needs to let you know that it should be fixed. This is called
control flow:

The most important sort of control flow is the `if` statement.

	function demonstrateIf(value){
		if(value===true){
			return "I got true.";
		} else {
			return "I got false.";
		}
	}
	
	demonstrateIf(true) -> "I got true."
	demonstrateIf(false) -> "I got false."
	demonstrateIf(0===1) -> "I got false."
	
Here is how we break up an if statement:

    |if(|value===true|){
		|return "I got true."|;
	} else {
		|return "I got false."|;
	}|
	
That is, to evaluate an if statement, we first evaluate the thing in
the parenthesis after `if`. If that value is `true` or "true like"
(anything other than false or zero or a few other things), we evaluate
_only_ the first clause. Otherwise we evaluate _only_ the second
clause. That is the critical idea: only one leg of an "if" statement
is ever evaluated. That is how it lets us do control flow.

Finally, in our whirlwind tour: `for` loops. The "for" loop lets us
indicate a desire to repeat things:

    for(var i = 0; i < 10; i = i + 1){
		console.log("i is:", i);
	}
	
	-> i is 0
	   i is 1
	   i is 2
	   i is 3
	   
We break it up this way:

    |for(|var i = 0|; |i < 10|; |i = i + 1|){
		|console.log("i is:", i);|
	}|
 
 The first clause of the `for` part of the statement is evaluated once
 and initializes some state, in this case a variable `i`. The second
 clause is a condition which is tested each time the loop executes. If
 it is true, the loop body is executed. After that, the last clause is
 executed. Generally that clause needs to update the state somehow, so
 that the middle clause eventually is false. Otherwise our loop would
 continue forever.
 
 


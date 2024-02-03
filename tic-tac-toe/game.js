var winConditions = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
var squareCount = 9;
var squares = document.getElementsByClassName("square");
var difficulty = "moron";
var gameOver = false;
var marker="O";
var winCount = 0;
var lostCount = 0;

var setMessageBox = function( caption )
{
	var messageBox = document.getElementById( "messageBox" );
    messageBox.innerHTML = caption;
};

var setCountBox = function( caption )
{
	var countBox = document.getElementById( "count" );
    countBox.innerHTML = caption;
};

var findClaimedSquares = function( marker )
{
	var claimedSquares = [];
	var value;

	for( var id = 0; id < squareCount; id++ )
	{
		value = document.getElementById( id ).innerHTML;
		if( value === marker )
		{
			claimedSquares.push(id);
		}
	}

	return claimedSquares;
}

var resetGame = function()
{
	gameOver = false;
	setMessageBox( "Pick a square!" );

	for( var id = 0; id < squareCount; id++ )
	{
		var square = document.getElementById( id );
		square.innerHTML = "";
		square.style.backgroundColor = "rgb(102, 178, 255)";
	}
}

var checkForWinCondition = function( marker )
{
	var claimedSquares = findClaimedSquares( marker );

	var win = false;
	for( var i = 0; i < winConditions.length; i++ )
	{
		win = winConditions[i].every( element => claimedSquares.indexOf( element ) > -1 );
		if( win )
		{
			win = winConditions[i];
			break;
		}
	}
	return win;
};

var secureWin = function(marker)
{
	return makeMove( marker,1 );
}

var preventDefeat = function(marker)
{   if(marker=="O"){
	return makeMove("X",2);}
	else {
	return makeMove("O",2);}
}

var makeMove = function( marker,number )
{
	var moveMade = false;
	for( var i = 0; i < winConditions.length; i++ )
	{
		var count = 0;
		for( var j = 0; j < winConditions[i].length; j++ )
		{
			if(  marker === document.getElementById( winConditions[i][j] ).innerHTML )
			{
				count++;
			}
		}

		if( count == 2 )
		{
			for( j = 0; j < winConditions[i].length; j++ )
			{
				var square = document.getElementById( winConditions[i][j] )
				if( squareIsOpen( square ) )
				{   if (number==1){
					square.innerHTML = marker;
				}else if(number==2){
					if(marker=="O"){
					square.innerHTML = "X";}
					else {square.innerHTML = "O";}
				}
					moveMade = true;
					break;
				}
			}
		}

		if( moveMade )
		{
			break;
		}
	}
	return moveMade;
}

var opponentMove = function(marker)
{
	if( difficulty === "moron" )
	{
		makeMoveAtFirstAvailableSquare(marker);
	}
	else
	{
		var moveMade = secureWin(marker);
		if( !moveMade )
		{
			moveMade = preventDefeat(marker);
			if( !moveMade )
			{
				var center = document.getElementById( 4 );
				if( squareIsOpen( center  ) )
				{
					center.innerHTML = marker;
				}
				else
				{
					makeMoveAtFirstAvailableSquare(marker);
				}
			}
		}
	}
}

var makeMoveAtFirstAvailableSquare = function(marker)
{
	for( var id = 0; id < squareCount; id++ )
	{
		square = document.getElementById( id );
		if( squareIsOpen( square ) )
		{
			square.innerHTML = marker;
			break;
		}
	}
}

var squareIsOpen = function( square )
{
	return ( square.innerHTML !== "X" && square.innerHTML !== "O" );
}

var highlightWinningSquares = function( winningSquares, color )
{
	for( var i = 0; i < winningSquares.length; i++ )
	{
		document.getElementById( winningSquares[i] ).style.backgroundColor = color;
	}
}

var checkForDraw = function()
{
	var draw = true;
	for( var id = 0; id < squareCount; id++ )
	{
		if( squareIsOpen( document.getElementById( id ) ) )
		{
			draw = false;
			break;
		}
	}
	return draw;
}

var chooseSquare = function() 
{
	difficulty = document.getElementById("difficulty").value;
	myMarker = document.getElementById("myMarker").value;
	if(myMarker=="O") marker= "X";
	else marker="O";
	if( !gameOver )
	{
		setMessageBox( "Pick a square!" );
	    var id = this.getAttribute("id");
	    var square = document.getElementById( id );
	    if( squareIsOpen( square ) ) 
	    {
	    	square.innerHTML = myMarker;
	    	var win = checkForWinCondition( myMarker );
	    	if( !win )
	    	{
	    		opponentMove(marker);
	    		var lost = checkForWinCondition( marker );
	    		if( !lost)
	    		{
	    			var draw = checkForDraw();
	    			if( draw )
	    			{
	    				gameOver = true;
	    				setMessageBox( "It's a draw!" );
	    			}
	    		}
	    		else
	    		{
	    			gameOver = true;
	    			highlightWinningSquares( lost, "rgb(229, 55, 55)" );
	    			setMessageBox( "You lost!" );
					lostCount++;
					setCountBox("Win:"+winCount+"&nbsp&nbsp&nbsp"+"Lose:"+lostCount);
	    		}
	    	}
	    	else
	    	{
	    		gameOver = true
	    		highlightWinningSquares( win, "rgb(42, 178, 72)" );
	    		setMessageBox( "You won!" );
				winCount++;
				setCountBox("Win:"+winCount+"&nbsp&nbsp&nbsp"+"Lose:"+lostCount);
	    	}

	    }
	    else
	    {
	    	setMessageBox( "That square is already taken!" );
	    }
	}
};


for (var i = 0; i < squares.length; i++) 
{
    squares[i].addEventListener('click', chooseSquare, false);
}




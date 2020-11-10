//CONTROLLER PAGE JS
document.addEventListener('gesturestart', function (e) 
{
    e.preventDefault();
});

window.addEventListener('resize', () => 
{
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
	ScaleElements();
});

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

var portrait=false;

var changedToPortraitFromLandscape=false;

// Listen for orientation changes
window.addEventListener("orientationchange", function() 
{
	if(window.innerHeight > window.innerWidth)
	{
		//LANDSCAPE
		if(changedToPortraitFromLandscape)
		{
			//alert("you did a switch");
			var right = document.getElementById('right_button');
			right.style.bottom= 100;
		}
	}
	else
	{
		

		//PORTAIT
		if(!changedToPortraitFromLandscape)
		{
			changedToPortraitFromLandscape=true;
		}
	}
	
	
	
}, false);

function ScaleElements()
{
	if(window.innerHeight > window.innerWidth)
	{
		//PORTAIT
		portrait=true;
		var reset = document.getElementById('reset_button');

		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;

		var boost = document.getElementById('boost_button');

		var fwd = document.getElementById('fwd_button');
		var back = document.getElementById('back_button');

		var left = document.getElementById('left_button');
		var right = document.getElementById('right_button');

		reset.style.top=HEIGHT/3;

		left.style.width = WIDTH/2.5;
		left.style.height = WIDTH/2.5;

		right.style.width = WIDTH/2.5;
		right.style.height = WIDTH/2.5;
		right.style.top = WIDTH/2.2;

		boost.style.width = WIDTH/2.2;
		boost.style.height = boost.style.width;

		fwd.style.width = WIDTH/2.3;
		fwd.style.height = boost.style.width/2;

		back.style.width = fwd.style.width;
		back.style.height = boost.style.width/2;

	}
	else
	{
		portrait=false;
		//LANDSCAPE
		var reset = document.getElementById('reset_button');

		reset.style.top=0;

		var WIDTH = window.innerHeight;
		var HEIGHT = window.innerWidth;

		var boost = document.getElementById('boost_button');

		var fwd = document.getElementById('fwd_button');
		var back = document.getElementById('back_button');

		var left = document.getElementById('left_button');
		var right = document.getElementById('right_button');

		left.style.width = WIDTH/2.5;
		left.style.height = WIDTH/2.5;

		right.style.width = WIDTH/2.5;
		right.style.height = WIDTH/2.5;

		boost.style.width = WIDTH/2.2;
		boost.style.height = boost.style.width;

		fwd.style.width = WIDTH/2.3;
		fwd.style.height = boost.style.width/2.5;

		back.style.width = fwd.style.width;
		back.style.height = boost.style.width/2.5;
	}

}

var playerName="";
var username="";

var socket = io
({
	transports: ['websocket']
});

// setTimeout(function() 
// {
// 	$('#loading').fadeOut('fast');
// }, 3000);

function Reset()
{
	window.location='';
}

function SelectCar(carName)
{	
	username = carName;
	socket.emit('add user', carName);

	$('#loginPage').hide()
	$('#playPage').show()

	socket.emit('enterGame', { user: playerName, direction: playerName });
}

function Start()
{
	if(document.getElementById('name_input').value=="")
	{
		alert("Please enter in your name!");
		return;
	}
	
	document.getElementById('landing_page').style.display="none";
	document.getElementById('car_buttons').style.display="block";

	localStorage.setItem("userNaam",document.getElementById('name_input').value);

	playerName = document.getElementById('name_input').value;
	
	document.body.requestFullscreen();
}

$(document).ready(function() 
{
	window.scrollTo(0,1);

	var naam = localStorage.getItem("userNaam");

	if(naam!=null)
	{
		document.getElementById('name_input').value = naam;
	}

	var wodth = window.innerWidth;
	var hoght = window.innerHeight;

	var touchingLeft=false;
	var touchingRight=false;
	var touchingBack=false;
	var touchingFwd=false;

	document.body.addEventListener('touchmove', function(e)
	{
		var x = Math.round(e.changedTouches[0].pageX);
		var y = Math.round(e.changedTouches[0].pageY);
		var xPerc = (x/wodth) * 100;
		var yPerc = (y/hoght) * 100;
		
		xPerc = Math.round(xPerc);
		yPerc = Math.round(yPerc);

		var status = "";

		if(xPerc > 50)
		{
			
			//TOP HALF OF SCREEN
			status = "top half";

			//TOUCHING ACCELERATE BUTTON
			if(yPerc > 70)
			{
				if(!touchingFwd)
				{
					//tax.innerText = "PRESSED FWD";
					//socket.emit('action', { user: username, direction: 'acc_down' });
					touchingFwd=true;
					//navigator.vibrate(100);
				}
			}
			else
			{
				if(touchingFwd)
				{
					//tax.innerText = "RELEASED FWD";
					//socket.emit('action', { user: username, direction: 'acc_up' });
					touchingFwd=false;
					//navigator.vibrate(100);
				}
			}

			//RELEASING ANY BUTTON FROM BOTTOM HALF OF SCREEN
			
			if(touchingBack)
			{
					//tax.innerText = "RELEASED BACK";	
					//socket.emit('action', { user: username, direction: 'rev_up' });
					touchingBack=false;
			}	


			if(yPerc<70)
			{
				if(touchingRight)
				{
					//tax.innerText = "RELEASED RIGHT";
					socket.emit('action', { user: username, direction: 'turnR_up' });	
					touchingRight=false;
				}

				if(touchingLeft)
				{
					//tax.innerText = "RELEASED LEFT";
					socket.emit('action', { user: username, direction: 'turnL_up' });	
					touchingLeft=false;
				}
			}

		}
		else
		{
			//BOTTOM HALF OF SCREEN
			status = "bottom half";

			//TOUCHING REVERSE BUTTON
			if(yPerc > 70)
			{

				//RELEASING FWD BUTTON
				if(touchingFwd)
				{
					//tax.innerText = "RELEASED FWD";
					//socket.emit('action', { user: username, direction: 'acc_up' });	
					touchingFwd=false;
				}	

				if(!touchingBack)
				{
					//tax.innerText = "PRESSED BACK";
					//socket.emit('action', { user: username, direction: 'rev_down' });
					touchingBack=true;
					//navigator.vibrate(100);
				}
			}
			else
			{
				if(touchingBack)
				{
					//tax.innerText = "RELEASED BACK";
					//socket.emit('action', { user: username, direction: 'rev_up' });
					touchingBack=false;
					//navigator.vibrate(100);
				}
			}

			//TOUCHING TURN RIGHT BUTTON
			if(yPerc > 30 && yPerc < 60)
			{
				if(!touchingRight)
				{
					//tax.innerText = "PRESSED RIGHT";
					socket.emit('action', { user: username, direction: 'turnR_down' });
					touchingRight=true;
					//navigator.vibrate(100);	
				}
				
			}
			else
			{
				if(touchingRight)
				{
					//tax.innerText = "RELEASED RIGHT";
					socket.emit('action', { user: username, direction: 'turnR_up' });	
					touchingRight=false;
				}
			}

			//TOUCHING TURN LEFT BUTTON
			if(yPerc<25)
			{
				if(!touchingLeft)
				{
					//tax.innerText = "PRESSED LEFT";
					socket.emit('action', { user: username, direction: 'turnL_down' });
					touchingLeft=true;
					//navigator.vibrate(100);	
				}	
			}
			else
			{
				if(touchingLeft)
				{
					//tax.innerText = "RELEASED LEFT";
					socket.emit('action', { user: username, direction: 'turnL_up' });	
					touchingLeft=false;
				}
			}
		}

	}, false)

	ScaleElements();

	socket.emit('openPage',"wut");
	$('#playPage').hide();
	$('#loginPage').show()

	socket.on('client set score', (data) => 
	{
		var userData = JSON.parse(data);

		$.get( "https://mustardinteractive.co.za/MTN_wheels/api/update_score.php?username="+playerName+"&score="+userData.score, function( data ) {});
	});

	socket.on('user left', (data) => 
	{
		var userData = JSON.parse(data);	

		if(userData.username === username)
		{
			$.get( "https://mustardinteractive.co.za/MTN_wheels/api/update_score.php?username="+playerName+"&score="+userData.score, function( data ) {});
		}

		if(userData.username === "1")
		{
			document.getElementById("car_1").style.opacity="1.0";
			document.getElementById('car_1').onclick = function() { SelectCar('1') };
		}

		if(userData.username === "2")
		{
			document.getElementById("car_2").style.opacity="1.0";
			document.getElementById('car_2').onclick = function() { SelectCar('2') };
		}

		if(userData.username === "3")
		{
			document.getElementById("car_3").style.opacity="1.0";
			document.getElementById('car_3').onclick = function() { SelectCar('3') };
		}

		if(userData.username === "4")
		{
			document.getElementById("car_4").style.opacity="1.0";
			document.getElementById('car_4').onclick = function() { SelectCar('4') };
		}

		if(userData.username === "5")
		{
			document.getElementById("car_5").style.opacity="1.0";
			document.getElementById('car_5').onclick = function() { SelectCar('5') };
		}

		if(userData.username === "6")
		{
			document.getElementById("car_6").style.opacity="1.0";
			document.getElementById('car_6').onclick = function() { SelectCar('6') };
		}

		if(userData.username === "7")
		{
			document.getElementById("car_7").style.opacity="1.0";
			document.getElementById('car_7').onclick = function() { SelectCar('7') };
		}

		if(userData.username === "8")
		{
			document.getElementById("car_8").style.opacity="1.0";
			document.getElementById('car_8').onclick = function() { SelectCar('8') };
		}
	});

	socket.on('client get powerup', (data) => 
	{
		var userData = JSON.parse(data);

		if(userData.username === username)
		{
			if(userData.score=="EMP")
				document.getElementById("boostIMG").src="art/emp.png";

			if(userData.score=="SHIELD")
				document.getElementById("boostIMG").src="art/shield.png";

			if(userData.score=="REPAIR")
				document.getElementById("boostIMG").src="art/repair.png";

			if(userData.score=="SWITCH")
				document.getElementById("boostIMG").src="art/switch.png";
		}
		
	});

	socket.on('client set color', (data) => 
	{
		var userData = JSON.parse(data);
		
		//PERFORM ONLY FOR SPECIFIED PLAYER [CHANGE PLAYERS CONTROLLER COLOR]
		if(userData.username === username)
		{//<---- User specific check

			var hex="";

			if(userData.username === "1")
			{
					hex="#036987";
			}

			if(userData.username === "2")
			{
					hex="#F4F4F2";
			}

			if(userData.username === "3")
			{
					hex="#4BC0ED";
			}

			if(userData.username === "4")
			{
					hex="#F57E20";
			}

			if(userData.username === "5")
			{
					hex="#E4256E";
			}

			if(userData.username === "6")
			{
					hex="#663F5C";
			}

			if(userData.username === "7")
			{
					hex="#FFCB0A";
			}

			if(userData.username === "8")
			{
					hex="#87B08C";
			}

			document.getElementById("boost_button").style.backgroundColor=hex;
			document.getElementById("reset_button").style.backgroundColor=hex;
			document.getElementById("fwd_button").style.backgroundColor=hex;
			document.getElementById("back_button").style.backgroundColor=hex;
			document.getElementById("left_button").style.backgroundColor=hex;
			document.getElementById("right_button").style.backgroundColor=hex;

		}//<---- End user specific check

		//PERFORM FOR ALL PLAYERS(DISABLE CAR THAT JUST ENTERED GAME SO OTHER PLAYERS CANNOT USE IT - NO DUPLICATE CARS)

		if(userData.username === "1")
		{
				document.getElementById("car_1").style.opacity="0.4";
				document.getElementById('car_1').removeAttribute("onclick");
		}

		if(userData.username === "2")
		{
				document.getElementById("car_2").style.opacity="0.4";
				document.getElementById('car_2').removeAttribute("onclick");
		}

		if(userData.username === "3")
		{
				document.getElementById("car_3").style.opacity="0.4";
				document.getElementById('car_3').removeAttribute("onclick");
		}

		if(userData.username === "4")
		{
				document.getElementById("car_4").style.opacity="0.4";
				document.getElementById('car_4').removeAttribute("onclick");
		}

		if(userData.username === "5")
		{
				document.getElementById("car_5").style.opacity="0.4";
				document.getElementById('car_5').removeAttribute("onclick");
		}

		if(userData.username === "6")
		{
				document.getElementById("car_6").style.opacity="0.4";
				document.getElementById('car_6').removeAttribute("onclick");
		}

		if(userData.username === "7")
		{
				document.getElementById("car_7").style.opacity="0.4";
				document.getElementById('car_7').removeAttribute("onclick");
		}

		if(userData.username === "8")
		{
				document.getElementById("car_8").style.opacity="0.4";
				document.getElementById('car_8').removeAttribute("onclick");
		}

	});

	$('#boost_button').on('touchstart', function()
	{
		socket.emit('action', { user: username, direction: 'boost' }); 
		document.getElementById("boostIMG").src="art/boost.png";
	});

    $('#fwd_button').on('touchstart', function()
	{
		socket.emit('action', { user: username, direction: 'acc_down' }); 
		//navigator.vibrate(100);
		//touchingFwd = true;
	});

	$('#fwd_button').on('touchend', function()
	{
		socket.emit('action', { user: username, direction: 'acc_up' }); 
		//navigator.vibrate(100);
		//touchingFwd = false;
	});

	$('#back_button').on('touchstart', function()
	{
		socket.emit('action', { user: username, direction: 'rev_down' }); 
		//navigator.vibrate(100);
		//touchingBack = true;
	});

	$('#back_button').on('touchend', function()
	{
		socket.emit('action', { user: username, direction: 'rev_up' });
		 //navigator.vibrate(100);
		 //touchingBack=false;
	});

	$('#left_button').on('touchstart', function()
	{
		socket.emit('action', { user: username, direction: 'turnL_down' }); 
		//navigator.vibrate(100);
		//touchingLeft=true;
	});

	$('#left_button').on('touchend', function()
	{
		socket.emit('action', { user: username, direction: 'turnL_up' }); 
		//navigator.vibrate(100);
		//touchingLeft=false;
	});

	$('#right_button').on('touchstart', function()
	{
		socket.emit('action', { user: username, direction: 'turnR_down' }); 
		//navigator.vibrate(100);
		//touchingRight=true;
	});

	$('#right_button').on('touchend', function()
	{
		socket.emit('action', { user: username, direction: 'turnR_up' }); 
		//navigator.vibrate(100);
		//touchingRight=false;
	});

});

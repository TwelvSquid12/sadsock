//CONTROLLER PAGE JS
document.addEventListener('gesturestart', function (e) 
{
    e.preventDefault();
});

window.addEventListener('resize', () => 
{
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

var playerName="";
	getParamValue('username');

function getParamValue(paramName)
{
    var valid=false;
    
    var url = window.location.search.substring(1); 
    var qArray = url.split('&');
	
    for (var i = 0; i < qArray.length; i++) 
    {
        var pArr = qArray[i].split('='); 
        if (pArr[0] == paramName)
        {
			playerName=pArr[1];
        }
    }
}

var socket = io({
	transports: ['websocket']
});

setTimeout(function() 
{
	$('#loading').fadeOut('fast');
}, 3000); // <-- time in milliseconds

function Reset()
{
	window.location='';
	navigator.vibrate(100);
}

function SelectCar(carName)
{	
	socket.emit('add user', carName);
	$('#loginPage').hide()
	$('#playPage').show()
	navigator.vibrate(100);
}

$(document).ready(function() 
{
	socket.emit('openPage',"wut");
    $('#playPage').hide();

	socket.on('client set score', (data) => 
	{
		navigator.vibrate(100);
		var userData = JSON.parse(data);
		$.get( "https://mustardinteractive.co.za/cargame/api/update_score.php?username="+playerName+"&score="+userData.score, function( data ) {});
	});

	socket.on('user left', (data) => 
	{
		var userData = JSON.parse(data);	
		
		alert(userData.username);

		if(userData.username === username)
		{
			$.get( "https://mustardinteractive.co.za/cargame/api/update_score.php?username="+playerName+"&score="+userData.score, function( data ) {});
		}

		if(userData.username === "Princess Muffins")
		{
				document.getElementById("muffins").style.opacity="1.0";
				document.getElementById('muffins').onclick = function() { SelectCar('muffins') };
		}
	});

	socket.on('client set color', (data) => 
	{
		var userData = JSON.parse(data);

		if(userData.username === "Princess Muffins")
		{
				document.getElementById("muffins").style.opacity="0.4";
				document.getElementById('muffins').removeAttribute("onclick");
		}

		if(userData.username === "Spicey Rodney")
		{
				document.getElementById("rodney").style.opacity="0.4";
				document.getElementById('rodney').removeAttribute("onclick");
		}

		if(userData.username === "Rocket")
		{
				document.getElementById("rocket").style.opacity="0.4";
				document.getElementById('rocket').removeAttribute("onclick");
		}

		if(userData.username === "Beetle")
		{
				document.getElementById("beetle").style.opacity="0.4";
				document.getElementById('beetle').removeAttribute("onclick");
		}

		if(userData.username === "Carmato")
		{
				document.getElementById("carmato").style.opacity="0.4";
				document.getElementById('carmato').removeAttribute("onclick");
		}

		if(userData.username === "Bakkuzi")
		{
				document.getElementById("bakkuzi").style.opacity="0.4";
				document.getElementById('bakkuzi').removeAttribute("onclick");
		}
	});

	var username;

    $('#accel_button').on('touchstart', function()
	{
		socket.emit('action', { user: username, direction: 'acc_down' });
	});

	$('#accel_button').on('touchend', function()
	{
		socket.emit('action', { user: username, direction: 'acc_up' });
	});

	$('#reverse_button').on('touchstart', function()
	{
		socket.emit('action', { user: username, direction: 'rev_down' });
	});

	$('#reverse_button').on('touchend', function()
	{
		socket.emit('action', { user: username, direction: 'rev_up' });
	});

	$('#left_button').on('touchstart', function()
	{
		socket.emit('action', { user: username, direction: 'turnL_down' });
	});

	$('#left_button').on('touchend', function()
	{
		socket.emit('action', { user: username, direction: 'turnL_up' });
	});

	$('#right_button').on('touchstart', function()
	{
		socket.emit('action', { user: username, direction: 'turnR_down' });
	});

	$('#right_button').on('touchend', function()
	{
		socket.emit('action', { user: username, direction: 'turnR_up' });
	});

});

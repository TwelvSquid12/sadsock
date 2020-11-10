var socket = io({
	transports: ['websocket']
});



setTimeout(function() {
	$('#loading').fadeOut('fast');
}, 3000); // <-- time in milliseconds


var _username = "";


$(document).ready(function() {


	socket.on('client set score', (data) => 
	{
		navigator.vibrate(1000);

		var userData = JSON.parse(data);

		if (data.username === socket.username) {
			//document.getElementById('scorePanel').innerHTML = "SCORE: " + userData.score;

			$('#scorePanel').html("<h1>Score: " + userData.score + "</h1>");
		}
	});


	socket.on('client set color', (data) => 
	{

		var userData = JSON.parse(data);

		if (data.username === socket.username) 
		{
			
			$('#namePanel').html("<h2 style='color:#"+userData.score+"'> " + userData.username + "</h2>");

			//$("#body").css("background-color",userData.score);

			 $(this).css("background-color", userData.score);
		}
	});


	function hideKeyboard() {
		//this set timeout needed for case when hideKeyborad
		//is called inside of 'onfocus' event handler
		setTimeout(function() {
			//creating temp field
			var field = document.createElement('input');
			field.setAttribute('type', 'text');
			//hiding temp field from peoples eyes
			//-webkit-user-modify is nessesary for Android 4.x
			field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;');
			document.body.appendChild(field);

			//adding onfocus event handler for out temp field
			field.onfocus = function() {
				//this timeout of 200ms is nessasary for Android 2.3.x
				setTimeout(function() {
					field.setAttribute('style', 'display:none;');
					setTimeout(function() {
						document.body.removeChild(field);
						document.body.focus();
					}, 14);
				}, 200);
			};
			//focusing it
			field.focus();
		}, 50);
	}

	var username;

	$('#namePanel').on('click', function() 
	{
		//socket.emit('respawn', socket.username);

//		if (_username.length > 0) {
//
//			//
//
//		
//		}
		navigator.vibrate(1000);
	});

	// button actions
	$('#btnUP').on('click', function() {
		socket.emit('action', { user: username, direction: 'up' });
		navigator.vibrate(100);
	});
	$('#btnDOWN').on('click', function() {
		socket.emit('action', { user: username, direction: 'down' });
		navigator.vibrate(100);
	});
	$('#btnLEFT').on('click', function() {
		socket.emit('action', { user: username, direction: 'left' });
		navigator.vibrate(100);
	});
	$('#btnRIGHT').on('click', function() {
		socket.emit('action', { user: username, direction: 'right' });
		navigator.vibrate(100);
	});

	$('#usernameText').focus(function() {
		// do something
		$('#usernameText').hide();
	});

	// on type in login screen
	$('.usernameInput').on('keypress', function(e) 
	{
		if ((e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0) == 13) 
		{
			e.preventDefault();
			hideKeyboard();
		}
	});

	$('#go').on('click', function() {
		username = $('.usernameInput').val();
		if (username.length > 0) {
			socket.emit('add user', username);
			$('.login').hide();
		}
		navigator.vibrate(100);
	});
});

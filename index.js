// Setup basic express server
var express = require('express');
var app = express();

var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var unitySocket;
var userSockets = {};

server.listen(port, () => 
{
	console.log('Server listening at %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Users
var numUsers = 0;

io.on('connection', socket => 
{
	var addedUser = false;

	socket.on('add server', () => 
	{
		unitySocket = socket;
	});

	socket.on('openPage', username => 
	{
		socket.broadcast.emit('openPage', {});
	});

	socket.on('set color', data => 
	{
		socket.broadcast.emit('client set color', data);
	});

	socket.on('get powerup', data => 
	{
		socket.broadcast.emit('client get powerup', data);
	});

	//sending controller actions
	socket.on('action', data => 
	{
		if (unitySocket) 
		{
			data.username = socket.username;
			unitySocket.emit('action', data);
		}
	});

	//sending ENTER GAME
	socket.on('enterGame', data => 
	{
		if (unitySocket) 
		{
			data.username = socket.username;
			unitySocket.emit('enterGame', data);
		}
	});

	//Set Player Score
	socket.on('set score', data => 
	{
		var userData = JSON.parse(data);

		if (userSockets[userData.username]) 
		{
			userSockets[userData.username].emit('client set score', data);
		}
	});

	// when the client emits 'add user', this listens and executes
	socket.on('add user', username => 
	{
		if (addedUser) return;

		userSockets[username] = socket;

		// we store the username in the socket session for this client
		socket.username = username;
		++numUsers;
		addedUser = true;

		//I cant remember what this does but it sure as hell does it. Best not to fuck with it.
		socket.emit('login', 
		{
			numUsers: numUsers
		});

		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('user joined', 
		{
			username: socket.username,
			numUsers: numUsers,
			id: socket.id
		});
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', () => 
	{
		if (addedUser) 
		{
			--numUsers;

			//remove the user
			if (userSockets[socket.username]) 
			{
				delete userSockets[socket.username];
			}

			// echo globally that this client has left
			socket.broadcast.emit('user left', 
			{
				username: socket.username,
				numUsers: numUsers
			});
		}

		// if socket is unity socket remove its reference
		if (unitySocket && unitySocket.id === socket.id) 
		{
			delete unitySocket;
		}
	});

});

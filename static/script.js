const socket = io('http://localhost:3000/chat');
const roomSocket = io('http://localhost:3000/room');
let currentRoom = '';
const nickname = prompt('닉네임을 입력해 주세요.');

function sendMessage() {
  const message = document.getElementById('message').value;
  document.getElementById('chat').innerHTML += `<div>나 : ${message}</div>`;
  socket.emit('message', { message, nickname });
}

socket.on('connect', () => {
  console.log('connected');
});

socket.on('message', (message) => {
  document.getElementById('chat').innerHTML += `<div>${message}</div>`;
});

function createRoom() {
  const room = prompt('생성할 방의 이름을 입력해 주세요.');
  roomSocket.emit('createRoom', { room, nickname });
}

socket.on('notice', (data) => {
  document.getElementById('notice').innerHTML += `<div>${data.message}</div>`;
});

roomSocket.on('rooms', (data) => {
  console.log(data);
  document.getElementById('rooms').innerHTML = '';
  data.forEach((room) => {
    document.getElementById(
      'rooms',
    ).innerHTML += `<li>${room} <button onclick="joinRoom('${room}')">join</button></li>`;
  });
});

function joinRoom(room) {
  roomSocket.emit('joinRoom', { room, nickname, toLeaveRoom: currentRoom });
  currentRoom = room;
}

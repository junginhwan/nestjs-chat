const socket = io('http://localhost:3000/chat');
const roomSocket = io('http://localhost:3000/room');
let currentRoom = '';
const nickname = prompt('닉네임을 입력해 주세요.');

function sendMessage() {
  if (currentRoom === '') {
    alert('방을 선택해 주세요.');
    return;
  }
  const message = document.getElementById('message').value;
  const data = { message, nickname, room: currentRoom }
  document.getElementById('chat').innerHTML += `<div>나 : ${message}</div>`;
  roomSocket.emit('message', data);
  document.getElementById('message').value = "";
  return false;
}

socket.on('connect', () => {
  console.log('connected');
});

socket.on('message', (data) => {
  console.log(data);
  document.getElementById('chat').innerHTML += `<div>${data.message}</div>`;
});

function createRoom() {
  const room = prompt('생성할 방의 이름을 입력해 주세요.');
  roomSocket.emit('createRoom', { room, nickname });
}

socket.on('notice', (data) => {
  document.getElementById('notice').innerHTML += `<div>${data.message}</div>`;
});

roomSocket.on('message', (data) => {
  console.log(data);
  document.getElementById('chat').innerHTML += `<div>${data.message}</div>`;
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
  document.getElementById('chat').innerHTML = '';
  currentRoom = room;
}

window.addEventListener('load', () => {
  document.getElementById('message').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});

const socket = io(); // 소켓 연결

const welcome = document.getElementById("welcome");
const nicknameForm = welcome.querySelector("#name");
const roomnameForm = welcome.querySelector("#roomname");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector("#name input");
  console.log(`name set to ${input.value}`);
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
  // message submit listener
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomtSubmit(event) {
  event.preventDefault();
  const input = roomnameForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.vallue = "";
}

nicknameForm.addEventListener("submit", handleNicknameSubmit);
roomnameForm.addEventListener("submit", handleRoomtSubmit);

socket.on("welcome", (username) => {
  addMessage(`${username} joined!`);
});

socket.on("bye", (username) => {
  addMessage(`${username} left TT`);
});

socket.on("new_message", (msg) => {
  addMessage(`${msg}`);
});

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("#roomList");
  roomList.innerHTML = "";
  console.log(rooms.length);
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

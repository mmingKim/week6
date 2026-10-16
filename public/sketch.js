const socket = io();

const room = document.querySelector("#room");
const movableItems = document.querySelectorAll(".movable");

let selectedItem = null;

movableItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (selectedItem) {
      return;
    }

    event.stopPropagation();

    movableItems.forEach((piece) => {
      piece.classList.remove("selected");
    });

    selectedItem = item.dataset.id;
    item.classList.add("selected");
  });
});

room.addEventListener("click", (event) => {
  if (!selectedItem) {
    return;
  }

  const roomBox = room.getBoundingClientRect();
  const item = document.querySelector(`[data-id="${selectedItem}"]`);

  const itemWidth = item.offsetWidth / roomBox.width * 100;
  const itemHeight = item.offsetHeight / roomBox.height * 100;

  let x = (event.clientX - roomBox.left) / roomBox.width * 100;
  let y = (event.clientY - roomBox.top) / roomBox.height * 100;

  x = Math.max(0, Math.min(x - itemWidth / 2, 100 - itemWidth));
  y = Math.max(0, Math.min(y - itemHeight / 2, 100 - itemHeight));

  socket.emit("move furniture", {
    id: selectedItem,
    x: x,
    y: y
  });

  item.classList.remove("selected");
  selectedItem = null;
});

socket.on("room state", (roomState) => {
  Object.keys(roomState).forEach((id) => {
    const item = document.querySelector(`[data-id="${id}"]`);

    if (item) {
      item.style.left = roomState[id].x + "%";
      item.style.top = roomState[id].y + "%";
    }
  });
});

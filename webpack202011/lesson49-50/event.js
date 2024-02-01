const { EventEmitter } = require("events");
const event = new EventEmitter();
event.on("click", () => {
  console.log("click1");
});
event.on("click", () => {
  console.log("click2");
});
event.emit("click");

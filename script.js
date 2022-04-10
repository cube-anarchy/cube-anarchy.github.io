const canvas = document.getElementById("canvas");
const display = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bullets = [];
let healthPowerups = [];

window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function rect(x, y, width, height, color) {
    display.fillStyle = color;
    display.fillRect(x, y, width, height);
}

const mouse = {
    x: 0,
    y: 0,
    down: false
}

let inputText = "Player"

let inputBg = "#666666"

let keys = {};
document.onkeydown = function(e) {
    keys[e.key] = true
    if (inputFocus) {
        if (e.key.length == 1 && inputText.length < 16) {
            inputText += e.key;
        } else if (e.key == "Backspace") {
            inputText = inputText.substr(0, inputText.length - 1);
        }
    }
}

document.onkeyup = function(e) {keys[e.key] = false}

let angle = 90;

document.onmousemove = function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

let btnColor = "#00ff00"

function drawPlayer(obj) {
    rect(obj.x, obj.y, obj.width, obj.height, obj.color);
    display.font = "15px game"
    display.textAlign = "center";
    display.fillStyle = "black"
    display.fillText(obj.name, obj.x + 25, obj.y - 40);
    if (obj.rot == 1) {
        rect(obj.x, obj.y, 50, 10, "black")
    } else if (obj.rot == 2) {
        rect(obj.x, obj.y, 10, 50, "black")
    } else if (obj.rot == 3) {
        rect(obj.x, obj.y + 40, 50, 10, "black")
    } else if (obj.rot == 4) {
        rect(obj.x + 40, obj.y, 10, 50, "black")
    }
    rect(obj.x, obj.y - 30, 50, 10, "grey");
    rect(obj.x, obj.y - 30, obj.health * 10, 10, "#00ff00");
}

function drawPowerup(packet) {
    rect(packet.x, packet.y, 30, 30, "#00ff00");
    display.fillStyle = "black"
    display.fillText("+", packet.x + 16, packet.y + 22);
}

canvas.onmousedown = function(e) {
    mouse.down = true;
    if (client.gameStage == "game") {
        const angle = Math.atan2(e.clientY - canvas.height/2, e.clientX - canvas.width/2);
        connection.emit("bullet", {x: Math.cos(angle), y: Math.sin(angle)});
    }
}

let opacity = 100;

canvas.onmouseup = function() {
    mouse.down = false;
}

function line(x1, y1, x2, y2, color="red") {
    display.strokeStyle = color;
    display.lineWidth = 1;
    display.beginPath();
    display.moveTo(x1, y1);
    display.lineTo(x2, y2);
    display.stroke();
}

let inputFocus = false;

function draw() {
    if (client != {} && client != undefined) {
        display.clearRect(-2000, -2000, 5000, 5000);
        if (client.gameStage == "menu") {
            display.setTransform(1,0,0,1,0,0);      
            rect(-2000, -2000, 5000, 5000, "#f7f7f7");
            display.textAlign = "center";
            display.font = canvas.width/40 + "px game";
            rect(canvas.width/2 - canvas.width/5, canvas.height/2 - canvas.width/32.5, canvas.width/2.5, canvas.width/20, btnColor)
            rect(canvas.width/2 - canvas.width/5, canvas.height/2 - canvas.width/10, canvas.width/2.5, canvas.width/20, inputBg)
            display.fillStyle = "black";
            display.fillText("Cube Anarchy", canvas.width/2, canvas.width/9);
            display.fillText("Play", canvas.width/2, canvas.height/2 + canvas.width/200);
            display.fillText(inputText, canvas.width/2, canvas.height/2 - canvas.width/16)
            if (mouse.x > canvas.width/2 - canvas.width/5 && mouse.x < (canvas.width/2 - canvas.width/5) + canvas.width/2.5 && mouse.y > canvas.height/2 - canvas.width/32.5 && mouse.y < (canvas.height/2 - canvas.width/32.5) + canvas.width/20) {
                btnColor = "#34c400";
                if (mouse.down) {   
                    connection.emit("nameSent", inputText || "Player");
                    connection.emit("gameStart");
                }
            } else {
                btnColor = "#00ff00"
            }
            if (mouse.down) {
                if (mouse.x > canvas.width/2 - canvas.width/5 && mouse.x < (canvas.width/2 - canvas.width/5) + canvas.width/2.5 && mouse.y > canvas.height/2 - canvas.width/10 && mouse.y < (canvas.height/2 - canvas.width/10) + canvas.width/20) {    
                    inputBg = "grey";
                    inputText = "";
                    inputFocus = true;
                } else {
                    inputFocus = false;
                    inputBg = "#666666"
                }
            }
        }
        if (client.gameStage == "game" && client != {}) {
            line(-1000, -1000, -1000, 2000);
            line(-1000, -1000, 2000, -1000);
            line(2000, 2000, -1000, 2000);
            line(2000, 2000, 2000, -1000);
            display.setTransform(1,0,0,1,0,0);
            if (serverData != null && id != null) {
                line(30, 30, 30, 330, "blue");
                line(330, 30, 330, 330, "blue");
                line(30, 330, 330, 330, "blue");
                line(330, 30, 30, 30, "blue");
                let players = Object.values(serverData.players);
                players.forEach((player) => {
                    if (player.gameStage == "game") {
                        rect((player.x + 1000)/10 + 30, (player.y + 1000)/10 + 30, 5, 5, "red")
                    }
                })
                healthPowerups.forEach((packet) => {
                    rect((packet.x + 1000)/10 + 30, (packet.y + 1000)/10 + 30, 5, 5, "#00ff00")
                })
                display.translate(canvas.width/2 - client.x - 25, canvas.height/2 - client.y - 25);
                rect(25, 25, 50, 50, "red");
                healthPowerups.forEach((packet) => {
                    drawPowerup(packet);
                })
                for (let i = 0; i < Object.values(serverData.players).length; i++) {
                    if (Object.values(serverData.players)[i].gameStage == "game") {
                        drawPlayer(Object.values(serverData.players)[i]);
                    }
                }
            }
            //drawPlayer(player);
            if (keys['a'] || keys['ArrowLeft']) {
                connection.emit("directionChange", 2)
            } else if (keys['d'] || keys['ArrowRight']) {
                connection.emit("directionChange", 4)
            } else if (keys['w'] || keys['ArrowUp']) {
                connection.emit("directionChange", 1)
            } else if (keys['s'] || keys['ArrowDown']) {
                connection.emit("directionChange", 3)
            }
            bullets.forEach((bullet) => {
                rect(bullet.x, bullet.y, 10, 10, "yellow");
            })
        }
    } 
}

setInterval(draw, 1000/60);

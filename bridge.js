const connection = io("https://hunter-fighters.herokuapp.com");
let serverData;
let id;
let client;

connection.on("connect", function() {
    id = connection.id;
})

connection.on("dataSent", data => {
    serverData = data;
    bullets = serverData.bullets;
    client = serverData.players[id];
    healthPowerups = serverData.health;
})
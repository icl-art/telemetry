createChart("altitude", 0, 100000, 0, 3000, "#FFFFFF");
createChart("x", 0, 100000, -20, 20, "#FF0000");
createChart("y", 0, 100000, -20, 20, "#00FF00");
createChart("z", 0, 100000, -20, 20, "#0000FF");

let socket = new WebSocket("wss://shreybohra.com:2053");
let msgs = [];
socket.onopen = function () {
    console.log("socket opened");
}

socket.onmessage = async function (event) {
    let data = JSON.parse(event.data);
    if (data === "END") {
        console.log("END");
        return;
    }
    console.log(data);
    msgs.push(data);
}

altitude = document.getElementById("alt");
velocity = document.getElementById("velocity");
flight_time = document.getElementById("flight_time");
conn = document.getElementById("conn");
prev_time = 0;
prev_alt = 0;
const copySign = (x, y) => Math.sign(x) === Math.sign(y) ? x : -x;

setInterval(async () => {
    let data = msgs.shift();
    if (data === undefined) {
        conn.innerHTML = "DIS";
        conn.style.color = "#d91e18";
        return;
    }

    let roll = data["roll"];
    let pitch = data["pitch"];
    let yaw = data["yaw"];  
    
    set_euler(roll, pitch, yaw);

    conn.innerHTML = "LIVE";
    conn.style.color = "#03a678"
    update_x(data["time"], data["acc_x"]);
    update_y(data["time"], data["acc_y"]);
    update_z(data["time"], data["acc_z"]);
    update_altitude(data["time"], data["alt"]);
    altitude.innerHTML = data["alt"].toFixed(2) + "m";
    velocity.innerHTML = ((data["alt"] - prev_alt) / (data["time"] - prev_time)).toFixed(2) + "m/s";
    flight_time.innerHTML = (data["time"] / 1000).toFixed(2) + "s";
    prev_time = data["time"];
    prev_alt = data["alt"];
}, 50);

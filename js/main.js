createChart("altitude", 0, 100000, 0, 100, "#FFFFFF");
createChart("x", 0, 100000, -20, 20, "#FF0000");
createChart("y", 0, 100000, -20, 20, "#00FF00");
createChart("z", 0, 100000, -20, 20, "#0000FF");

let socket = new WebSocket(window.location.href.replace(/^http/, "ws"));
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

    let x = data["quat_i"];
    let y = data["quat_j"];
    let z = data["quat_k"];
    let w = data["quat_real"];
    
    let sinr_cosp = 2 * (w * x + y * z);
    let cosr_cosp = 1 - 2 * (x * x + y * y);
    let roll = atan2(sinr_cosp, cosr_cosp);

    let sinp = 2 * (w * y - z * x);
    let pitch = 0;
    if (abs(sinp) >= 1) {
        pitch = copySign(Math.PI / 2, sinp); // use 90 degrees if out of range
    } else{
        pitch = asin(sinp);
    }
    // yaw (z-axis rotation)
    let siny_cosp = 2 * (w * z + x * y);
    let cosy_cosp = 1 - 2 * (y * y + z * z);
    yaw = atan2(siny_cosp, cosy_cosp);

    set_euler(roll, pitch, yaw);

    conn.innerHTML = "CON";
    conn.style.color = "#03a678"
    update_x(data["time"], data["accel_x"]);
    update_y(data["time"], data["accel_y"]);
    update_z(data["time"], data["accel_z"]);
    update_altitude(data["time"], data["alt"]);
    altitude.innerHTML = data["alt"].toFixed(2) + "m";
    velocity.innerHTML = ((data["alt"] - prev_alt) / (data["time"] - prev_time)).toFixed(2) + "m/s";
    flight_time.innerHTML = (data["time"] / 1000).toFixed(2) + "s";
    prev_time = data["time"];
    prev_alt = data["alt"];
}, 50);
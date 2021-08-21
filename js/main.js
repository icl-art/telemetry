const AHRS = require("ahrs");
        const madgwick = new AHRS({
            sampleInterval: 50,
            algorithm: "Madgwick",
            beta: 0.4,
        });

        createChart("altitude", 0, 100000, 0, 100, "#FFFFFF");
        createChart("x", 0, 100000, -20, 20, "#FF0000");
        createChart("y", 0, 100000, -20, 20, "#00FF00");
        createChart("z", 0, 100000, -20, 20, "#0000FF");
        
        //let socket = new WebSocket(window.location.href.replace(/^http/, "ws"));
        let socket = new WebSocket("35.229.97.111");
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
        setInterval(async () => {
            let data = msgs.shift();
            if (data === undefined) {
                conn.innerHTML = "DIS";
                conn.style.color = "#d91e18";
                return;
            }

            madgwick.update(data["gyro_x"], data["gyro_y"], data["gyro_z"], data["accel_x"], data["accel_y"], data["accel_z"], data["mag_x"], data["mag_y"], data["mag_z"]);
            const angles = madgwick.getEulerAngles();
            set_euler(angles.roll, angles.pitch, angles.heading);

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
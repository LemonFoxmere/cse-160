/** @type {CanvasRenderingContext2D} */
let ctx;

function drawVecotor(v, color) {
    const ORIGIN_X = 200;
    const ORIGIN_Y = 200;

    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(ORIGIN_X, ORIGIN_Y);
    ctx.lineTo(ORIGIN_X + v.elements[0] * 20, ORIGIN_Y - v.elements[1] * 20);
    ctx.stroke();
}

function handleDrawEvent() {
    // read vals
    const v1x_elmnt = document.querySelector("#v1x");
    const v1y_elmnt = document.querySelector("#v1y");
    const v2x_elmnt = document.querySelector("#v2x");
    const v2y_elmnt = document.querySelector("#v2y");

    const v1x = Number(v1x_elmnt.value) || 0;
    const v1y = Number(v1y_elmnt.value) || 0;
    const v2x = Number(v2x_elmnt.value) || 0;
    const v2y = Number(v2y_elmnt.value) || 0;

    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = "hsla(0, 0, 0, 1.0)";
    ctx.fillRect(0, 0, 400, 400);

    const v1 = new Vector3([v1x, v1y, 0]);
    const v2 = new Vector3([v2x, v2y, 0]);
    drawVecotor(v1, "red");
    drawVecotor(v2, "blue");

    return [v1, v2];
}

function handleDrawOperationEvent() {
    /*
    Clear the canvas.
    Read the values of the text boxes to create v1 and call drawVector(v1, "red") .  
    Read the values of the text boxes to create v2 and call drawVector(v2, "blue") .  
    Read the value of the selector and call the respective Vector3 function. For add and sub operations, draw a green vector v3 = v1 + v2  or v3 = v1 - v2. For mul and div operations, draw two green vectors v3 = v1 * s and v4 = v2 * s.
    */

    let [v1, v2] = handleDrawEvent();
    const scalar_elmnt = document.querySelector("#scalar");
    const op_elmnt = document.querySelector("#operation");

    const scalar = scalar_elmnt.value;
    const op = op_elmnt.value;

    if (["add", "subtract"].includes(op)) {
        if (op === "add") v1.add(v2);
        else v1.sub(v2);
        drawVecotor(v1, "green");
    } else if (op === "magnitude") {
        console.log(`Magnitude of v1: ${v1.magnitude()}`);
        console.log(`Magnitude of v2: ${v2.magnitude()}`);
    } else if (op === "normalize") {
        const v3 = new Vector3();
        const v4 = new Vector3();
        v3.set(v1);
        v4.set(v2);
        v3.normalize();
        v4.normalize();

        drawVecotor(v3, "green");
        drawVecotor(v4, "green");
    } else if (op === "angbtwn") {
        console.log(
            `Angle: ${angleBetween(v1, v2)}`,
        );
    } else if (op === "area") {
        console.log(
            `Area of the triangle: ${areaTriangle(v1, v2)}`,
        );
    } else {
        const v3 = new Vector3();
        const v4 = new Vector3();
        v3.set(v1);
        v4.set(v2);

        if (op === "multiply") {
            v3.mul(scalar);
            v4.mul(scalar);
        } else {
            v3.div(scalar);
            v4.div(scalar);
        }

        drawVecotor(v3, "green");
        drawVecotor(v4, "green");
    }
}

function angleBetween(v1, v2) {
    return Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude())) * (180 / Math.PI)
}
function areaTriangle(v1, v2) {
    return Vector3.cross(v1, v2).magnitude() / 2
}

function main() {
    let canvas = document.getElementById("example");
    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return;
    }

    ctx = canvas.getContext("2d");

    ctx.fillStyle = "hsla(0, 0, 0, 1.0)";
    ctx.fillRect(0, 0, 400, 400);

    handleDrawEvent();
}

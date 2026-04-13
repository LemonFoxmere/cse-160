// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform float u_Size;
void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
}
`;

var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;
void main() {
    gl_FragColor = u_FragColor;
}
`;

// global var
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    setupDomUI();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    renderAllShapes();
}

let g_shapesList = [];
/*
0 -> point
1 -> triangle
2 -> circle
*/
let g_selectedShape = 0;
let g_jitter_clr = false;
let g_jitter_running = false;

function jitterLoop() {
    if (!g_jitter_clr) {
        g_jitter_running = false;
        renderAllShapes();
        return;
    }
    renderAllShapes();
    requestAnimationFrame(jitterLoop);
}

// var g_points = []; // The array for the position of a mouse press
// var g_colors = []; // The array to store the color of a point
// var g_sizes = [];

function setupDomUI() {
    // Register function (event handler) to be called on a mouse press
    if (!canvas) {
        console.error("No canvas to initialize listeners on!");
        return;
    }
    canvas.onmousedown = (e) => {
        canvas.onmousemove = handleClicks;
        document.onmouseup = () => {
            canvas.onmousemove = undefined;
        };
        handleClicks(e); // draw the initial pixel
    };
    canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    updateColorPicker();
    document.querySelector("#hue").oninput = updateColorPicker;
    document.querySelector("#sat").oninput = updateColorPicker;
    document.querySelector("#lum").oninput = updateColorPicker;
    
    document.querySelector("#picture").onclick = () => {
        g_jitter_clr = false;
        document.querySelector("#color-jit").classList.remove("selected");
        const img = document.querySelector("#carrot-img");
        const rect = canvas.getBoundingClientRect();
        img.style.top = rect.top + "px";
        img.style.left = (rect.right + 20) + "px";
        img.style.display = "block";
        requestAnimationFrame(renderPicture); // wait for state to clear
    };
    document.querySelector("#clear").onclick = () => {
        g_shapesList = [];
        renderAllShapes();
    };

    const pointBrush = document.querySelector("#point-brush");
    const triangleBrush = document.querySelector("#triangle-brush");
    const circleBrush = document.querySelector("#circle-brush");
    
    const colorJit = document.querySelector("#color-jit");

    pointBrush.onclick = () => {
        g_selectedShape = 0;
        setActiveBrush(g_selectedShape);
    };
    triangleBrush.onclick = () => {
        g_selectedShape = 1;
        setActiveBrush(g_selectedShape);
    };
    circleBrush.onclick = () => {
        g_selectedShape = 2;
        setActiveBrush(g_selectedShape);
    };

    colorJit.onclick = () => {
        g_jitter_clr = !g_jitter_clr;
        colorJit.classList.toggle("selected");
        if (g_jitter_clr && !g_jitter_running) {
            g_jitter_running = true;
            requestAnimationFrame(jitterLoop);
        }
    };
    setActiveBrush(g_selectedShape);
}

function setActiveBrush(shape) {
    const pointBrush = document.querySelector("#point-brush");
    const triangleBrush = document.querySelector("#triangle-brush");
    const circleBrush = document.querySelector("#circle-brush");

    pointBrush.classList.toggle("selected", shape === 0);
    triangleBrush.classList.toggle("selected", shape === 1);
    circleBrush.classList.toggle("selected", shape === 2);
}

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.querySelector("#webgl");

    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas, { preserveDrawingBuffer: true });
    if (!gl) {
        console.error("Failed to get the rendering context for WebGL");
        return;
    }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error("Failed to intialize shaders.");
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.error("Failed to get the storage location of a_Position");
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    if (!u_FragColor) {
        console.error("Failed to get the storage location of u_FragColor");
        return;
    }
    u_Size = gl.getUniformLocation(gl.program, "u_Size");
    if (!u_Size) {
        console.error("Failed to get the storage location of u_Size");
        return;
    }
}

function updateColorPicker() {
    const h = document.querySelector("#hue").value;
    const s = document.querySelector("#sat").value;
    const l = document.querySelector("#lum").value;

    document.querySelector("#hue").style.background =
        "linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))";
    document.querySelector("#sat").style.background =
        `linear-gradient(to right, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%))`;
    document.querySelector("#lum").style.background =
        `linear-gradient(to right, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%))`;

    document.querySelector("#preview").style.backgroundColor =
        `hsl(${h},${s}%,${l}%)`;
    document.querySelector("#hsl-label").innerHTML =
        `<strong>HSL</strong>: ${h}°, ${s}%, ${l}%`;
    document.querySelector("#hex-label").innerHTML =
        `<strong>HEX</strong>: ${hslToHex(h, s, l).toUpperCase()}`;
}

function handleClicks(ev) {
    let [x, y] = convertCoordEvtToGL(ev);

    const h = document.querySelector("#hue").value;
    const s = document.querySelector("#sat").value;
    const l = document.querySelector("#lum").value;
    const [r, g, b] = hslToRgb(h, s, l);

    let shape;

    switch (g_selectedShape) {
        case 1:
            shape = new Triangle();
            break;
        case 2:
            shape = new Circle();
            shape.numSide = document.querySelector("#circle-sides").value;
            break;
        default:
            shape = new Point();
    }

    shape.position = [x, y, 0.0];
    shape.color = [r, g, b, 1.0];
    shape.size = document.querySelector("#brush-size").value;
    g_shapesList.push(shape);

    renderAllShapes();
}

function convertCoordEvtToGL(ev) {
    let x = ev.clientX; // x coordinate of a mouse pointer
    let y = ev.clientY; // y coordinate of a mouse pointer

    // on resize
    let rect = ev.target.getBoundingClientRect();

    x = (x - rect.left - rect.width / 2) / (rect.width / 2);
    y = (rect.height / 2 - (y - rect.top)) / (rect.height / 2);

    return [x, y];
}

function renderAllShapes() {
    // const start = performance.now();

    document.querySelector("#carrot-img").style.display = "none";
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let shape of g_shapesList) {
        shape.render(g_jitter_clr);
    }

    // const ms = Math.round(performance.now() - start);
    // const fps = ms > 0 ? Math.round((1000 / ms) * 10) / 10 : "0";
    // document.querySelector("#debug-label").innerHTML =
    //     `<strong># shapes</strong>: ${g_shapesList.length} &nbsp; <strong>ms</strong>: ${ms} &nbsp; <strong>fps</strong>: ${fps}`;
}

// math from this: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
        const k = (n + h / 30) % 12;
        return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return [f(0), f(8), f(4)];
}

function hslToHex(h, s, l) {
    const [r, g, b] = hslToRgb(h, s, l);
    return (
        "#" +
        [r, g, b]
            .map((x) =>
                Math.round(x * 255)
                    .toString(16)
                    .padStart(2, "0"),
            )
            .join("")
    );
}

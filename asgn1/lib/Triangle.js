class Triangle {
    constructor() {
        this.type = "triangle";
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }

    render(jitter_clr = false) {
        let pos = this.position;
        let clr = this.color;
        let siz = this.size;

        let r_j = 0;
        let g_j = 0;
        let b_j = 0;
        if (jitter_clr) {
            r_j = (Math.random() - 0.5) * 0.6;
            g_j = (Math.random() - 0.5) * 0.6;
            b_j = (Math.random() - 0.5) * 0.6;
        }

        const r = Math.min(Math.max(clr[0] + r_j, 0), 1)
        const g = Math.min(Math.max(clr[1] + g_j, 0), 1)
        const b = Math.min(Math.max(clr[2] + b_j, 0), 1)

        gl.uniform4f(u_FragColor, r, g, b, clr[3]);
        gl.uniform1f(u_Size, siz);
        drawTriangle([
            pos[0],
            pos[1],
            pos[0],
            pos[1] + 0.01 * siz,
            pos[0] + 0.01 * siz,
            pos[1],
        ]);
    }
}

function drawTriangle(vertices) {
    // var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    // if (a_Position < 0) {
    //     console.log("Failed to get the storage location of a_Position");
    //     return -1;
    // }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    // return n;
}

function renderPicture() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    const x_offset = -3;
    const y_offset = -4;
    const x_scale = 0.15;
    const y_scale = -0.15;

    const green = [118/255, 180/255, 56/255, 1]
    const green_l1 = [150/255, 210/255, 90/255, 1]
    const green_d1 = [91/255, 154/255, 29/255, 1]
    const green_d2 = [66/255, 113/255, 18/255, 1]
    
    const orange = [214/255, 91/255, 17/255, 1]
    const orange_l1 = [234/255, 125/255, 70/255, 1]
    const orange_l2 = [255/255, 173/255, 130/255, 1]
    const orange_d1 = [193/255, 67/255, 21/255, 1]
    const orange_d2 = [155/255, 52/255, 21/255, 1]
    
    const white = [1, 1, 1, 1]
    const white_d1 = [0.8, 0.8, 0.8, 1]
    const white_d2 = [0.6, 0.6, 0.6, 1]

    const pic = [
        // leaf
        [green, 0, 0, 1, 1, 0, 1],
        [green_l1, 0, 1, 1, 1, 1.5, 2],
        [green_d2, 1, 1, 2, 1, 1.5, 2],
        [green_d1, 2, 1, 3, 1, 1.5, 2],
        [green, 2, 1, 3, 0, 3, 1],
        // body
        [orange_l2, 0, 3, 1, 2, 1, 3],
        [orange, 1, 2, 2, 2, 1, 6],
        [orange_d1, 1, 6, 2, 2, 2, 6],
        [orange_d1, 2, 3, 2, 2, 3, 3],
        [orange_l1, 0, 3, 1, 3, 1, 6],
        [orange_d2, 2, 3, 3, 3, 2, 6],
        [orange_d2, 1, 6, 2, 6, 1.5, 8.5],
        // sig
        [white, 3, 4, 3.5, 4, 3, 6],
        [white_d2, 3.25, 5, 4, 6, 3, 6],
        [white, 4.5, 4, 5, 4, 4.5, 6],
        [white_d1, 5, 4, 5, 6, 4.5, 6],
        [white_d1, 5, 4, 6, 4, 5, 4.5],
        [white, 5, 4.5, 6, 4, 5.75, 4.5],
        [white, 5, 4.75, 5.75, 4.75, 5, 5.25],
        [white_d2, 5, 5.25, 5.75, 4.75, 5.5, 5.25],
    ];

    for (let i = 0; i < pic.length; i++){
        clr = pic[i][0];
        tri = pic[i].slice(1);

        tri[0] = (tri[0] + x_offset) * x_scale;
        tri[2] = (tri[2] + x_offset) * x_scale;
        tri[4] = (tri[4] + x_offset) * x_scale;
        tri[1] = (tri[1] + y_offset) * y_scale;
        tri[3] = (tri[3] + y_offset) * y_scale;
        tri[5] = (tri[5] + y_offset) * y_scale;

        gl.uniform4f(u_FragColor, ...clr);
        drawTriangle(tri);
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

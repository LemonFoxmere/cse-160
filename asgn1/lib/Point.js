class Point {
    constructor() {
        this.type = "point";
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }

    render(jitter_clr = false) {
        let pos = this.position;
        let clr = this.color;
        let siz = this.size;

        gl.disableVertexAttribArray(a_Position);

        let r_j = 0;
        let g_j = 0;
        let b_j = 0;
        if (jitter_clr){
            r_j = (Math.random() - 0.5) * 0.6;
            g_j = (Math.random() - 0.5) * 0.6;
            b_j = (Math.random() - 0.5) * 0.6;
        }

        const r = Math.min(Math.max(clr[0] + r_j, 0), 1)
        const g = Math.min(Math.max(clr[1] + g_j, 0), 1)
        const b = Math.min(Math.max(clr[2] + b_j, 0), 1)

        gl.vertexAttrib3f(a_Position, pos[0], pos[1], 0.0);
        gl.uniform4f(u_FragColor, r, g, b, clr[3]);
        gl.uniform1f(u_Size, siz);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

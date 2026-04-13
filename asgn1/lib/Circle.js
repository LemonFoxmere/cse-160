class Circle {
    constructor() {
        this.type = "circle";
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.numSide = 5;
    }

    render(jitter_clr = false) {
        let pos = this.position;
        let clr = this.color;
        let siz = this.size;
        let side = this.numSide;

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

        const x = pos[0];
        const y = pos[1];
        const angleDiv = (2 * Math.PI) / side

        for (let i = 0; i < side; i++) {
            drawTriangle([
                x,
                y,
                x + Math.cos(i * angleDiv) * siz * 0.01,
                y + Math.sin(i * angleDiv) * siz * 0.01,
                x + Math.cos((i + 1) * angleDiv) * siz * 0.01,
                y + Math.sin((i + 1) * angleDiv) * siz * 0.01,
            ]);    
        }
    }
}

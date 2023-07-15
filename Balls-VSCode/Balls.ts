class BallDemo {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private greenBall: HTMLImageElement;

    private width: number = 1024;
    private height: number = 1024;
    private animTimer: number = 0;
    private angle: number = 0;
    private offset: number = -650;
    private size: number = 0;
    private b: number = -3;
    private c: number = 1;

    private cosine: Float32Array;
    private sine: Float32Array;

    private ogreX = [];
    private ogreY = [];
    private textData = [
        [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1]
    ];

    private rect(x: number, y: number, w: number, h: number): void {
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    public load(filename: string, type: string): void {
        let levelBytes: Float32Array;
        let _this = this;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', filename, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            levelBytes = new Float32Array(this.response);
        };
        xhr.onloadend = function () {
            if (type == "cosine") {
                _this.cosine = levelBytes;
            } else {
                _this.sine = levelBytes;
            }
        };
        xhr.send();
    }

    public initialize(): void {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.greenBall = <HTMLImageElement>document.getElementById("greenBall");

        for (let y = 0; y < 7; y++) {
            let a = 0;
            for (let x = 0; x < 36; x++) {
                if (this.textData[y][x] == 1) {
                    this.ogreX[this.c] = a;
                    this.ogreY[this.c] = this.b;
                    this.c += 1;
                }
                a += 1;
            }
            this.b += 1;
        }
    }

    public run(): void {
        if (this.cosine != undefined && this.sine != undefined) {
            this.draw();
        }
        requestAnimationFrame(this.run.bind(this));
    }

    private draw(): void {
        this.ctx.fillStyle = "black";
        this.rect(0, 0, this.width, this.height);
        this.logoRotate();
    }

    private logoRotate(): void {
        let lb = this.angle;
        let points = this.c;
        const lbAdd = 1;
        this.offset += 1;

        if (this.offset > -400) { this.offset = -400; }
        for (let a = 1; a < points - 1; a++) {
            let tx = this.offset + 800 + (this.cosine[lb] * this.ogreX[a] - this.sine[lb] * this.ogreY[a]) * this.size;
            let ty = 240 + (this.sine[lb] * this.ogreX[a] + this.cosine[lb] * this.ogreY[a]) * this.size;
            this.ctx.drawImage(this.greenBall, Math.floor(tx), Math.floor(ty));
            lb += lbAdd;
            if (lb > 1440) { lb = lb - 1440; }
            if (lb < 0) { lb = lb + 1440 };
        }

        this.size = 16 + this.sine[this.angle] * 14;

        this.animTimer += 0.1;
        if (this.animTimer > 0.2) {
            this.animTimer = 0;
            this.angle = this.angle + 2;
            if (this.angle > 1440) { this.angle = 0; }
        }
    }
}

export = BallDemo;

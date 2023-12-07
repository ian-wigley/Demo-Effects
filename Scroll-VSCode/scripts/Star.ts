export class Star {

    private speed: number = 0;
    private angle: number = 0;
    private ctx: CanvasRenderingContext2D;
    private x: number;
    private y: number;
    private radius: number;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
        this.speed = 0;
        this.angle = (Math.random() * 360);
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    private update(): void {
        this.speed += .01;
        this.angle += .01;
        this.x = (Math.cos(this.angle) * this.speed + this.x);
        this.y = (Math.sin(this.angle) * this.speed + this.y);
        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
            this.angle = (Math.random() * 360);
            this.speed = 0;
            this.x = 400;
            this.y = 300;
        }
    }

    private draw(): void {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.fill();
    }
}

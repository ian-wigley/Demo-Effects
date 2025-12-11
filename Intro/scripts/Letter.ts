export class Letter {

    private ascii: string;
    private screenPositionX: number;
    private screenPositionY: number;
    private index: number;
    private bitmapFont: HTMLImageElement;
    private ctx: CanvasRenderingContext2D;
    private x: number;
    private y: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        ascii: string,
        screenPositionX: number,
        screenPositionY: number,
        nextRow: boolean,
        index: number,
        bitmapFont: HTMLImageElement
    ) {
        this.ctx = ctx;
        this.ascii = ascii;
        this.index = index;
        this.screenPositionX = screenPositionX;
        this.screenPositionY = screenPositionY;
        this.bitmapFont = bitmapFont;
        const width = 62;
        const height = 66;
        if (nextRow) {
            this.x = (x * width);
            this.y = (y * height);
        } else {
            this.x = x;
            this.y = y;
        }
    }

    private update(screenPositionY: number): void {
        this.screenPositionX -= 1.0;
        this.screenPositionY = screenPositionY;
    }

    private draw(): void {
        this.ctx.beginPath();
        this.ctx.drawImage(this.bitmapFont, this.x, this.y, 64, 64, this.screenPositionX, this.screenPositionY, 32, 32);
        this.ctx.fill();
    }
}

import { Letter } from "./Letter.js"
import { Star } from "./Star.js"


export class App {
    private ctx: CanvasRenderingContext2D;
    private theta: number = 0;
    private background: HTMLImageElement;
    private bitmapFont: HTMLImageElement;
    private stars = new Array();
    private sineArray = new Array();
    private scrollingText = new Array();
    private letterFrames = new Array();
    private yScreenPosition: number = 100;
    private spacing: number = 30;
    private sineCounter: number = 0;

    private clear(): void {
        const WIDTH = 800;
        const HEIGHT = 600;
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    public init(): void {
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.background = new Image();
        this.background.src = "graphics/nebula.png";
        this.bitmapFont = new Image();
        this.bitmapFont.src = "graphics/bitmapFont.png";
        this.createLettersFromBitmap();
        this.calculateSineValues();
        this.populateScroll();
        this.createStars();
        this.run();
    }

    private createStars(): void {
        for (let i = 0; i < 200; i++) {
            const startX = 400;
            const startY = 300;
            this.stars.push(new Star(this.ctx, startX, startY, 1));
        }
    }

    private populateScroll(): void {
        let screenPositionX = 800;
        let screenPositionY = this.yScreenPosition;
        let index = 0;
        const scrollText = "{{{{welcome|to|a|funky|scroller{{{{{{{{{";
        for (let i = 0; i < scrollText.length; i++) {
            for (let j = 0; j < this.letterFrames.length; j++) {
                if (scrollText.charAt(i) == this.letterFrames[j].ascii) {
                    let trip = false;
                    let letter = new Letter(
                        this.letterFrames[j].ctx,
                        this.letterFrames[j].x,
                        this.letterFrames[j].y,
                        this.letterFrames[j].ascii,
                        screenPositionX,
                        screenPositionY,
                        trip,
                        index,
                        this.bitmapFont);
                    if (index < 14 * 10) {
                        index += 10;
                    } else {
                        index = 0;
                    }
                    this.scrollingText.push(letter);
                    screenPositionX += 30;
                }
            }
        }
    }

    private calculateSineValues(): void {
        let sineValue = 0;
        let sineCount = 0;
        let mSpeed = 4;
        let mAngle = 0;
        for (let i = 0; i < 13; i++) {
            mAngle += 0.5;
            sineValue = (Math.cos(mAngle) * mSpeed) + this.yScreenPosition;
            for (let j = 0; j < 10; j++) {
                this.sineArray[sineCount++] = sineValue;
            }
        }
    }

    private createLettersFromBitmap(): void {
        let screenPositionX = 100;
        let startAsciiCode = 97;
        let screenPositionY = 0;
        let timer = 0;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 4; j++) {
                let ascii = String.fromCharCode(startAsciiCode);
                let trip = true;
                let letter = new Letter(this.ctx, j, i, ascii, screenPositionX, screenPositionY, trip, timer, this.bitmapFont);
                this.letterFrames.push(letter);
                screenPositionX += 30;
                startAsciiCode++;
            }
        }
    }

    public run(): void {
        requestAnimationFrame(this.run.bind(this));
        this.update();
        this.draw();
    }

    private update(): void {
        this.stars.forEach(star => star.update());
        this.spacing = 30;
        let lastLetter = this.scrollingText[this.scrollingText.length - 1];
        this.scrollingText.forEach(s => {
            let index = s.index;
            if (lastLetter.screenPositionX <= 0) {
                s.screenPositionX = 800 + this.spacing;
                this.spacing += 30;
            }
            s.update(this.sineArray[s.index]);
            this.sineCounter = (this.sineCounter < this.sineArray.length - 1) ? this.sineCounter += 1 : 0;
            index = (index >= this.sineArray.length - 1) ? 0 : index += 1;
            s.index = index;
        });
    }

    private draw(): void {
        this.clear();
        this.ctx.fillStyle = "black";
        this.theta += 0.001;
        this.ctx.translate(400, 300);
        this.ctx.rotate(this.theta);
        this.ctx.drawImage(this.background, -700, -500, 1400, 1000);
        this.ctx.rotate(-this.theta);
        this.ctx.translate(-400, -300);

        this.scrollingText.forEach(s => s.draw());
        this.stars.forEach(star => { this.ctx.fillStyle = "grey"; star.draw(); });
    }
}
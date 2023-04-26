class Letter {
    private m_blockArray;
    private m_asciiCode;

    constructor(blockArray: Array<number>, asciiCode: number) {
        this.m_blockArray = blockArray;
        this.m_asciiCode = asciiCode;
    }

    public get block(): Array<number> {
        return this.m_blockArray;
    }

    public get asciiCode(): number {
        return this.m_asciiCode;
    }
}

class Mess {
    private m_canvas: HTMLCanvasElement;
    private m_ctx: CanvasRenderingContext2D;
    private m_blockImage: HTMLImageElement;
    private font = [];
    private m_letterHeight: number = 14;
    private m_letterWidth: number = 17;
    private m_text: string = "hello ...";
    private m_letterCollection = [];
    private m_scroll: number = 10;
    private m_stride: number = 17;
    private m_scaleX: number = 5;
    private m_scaleY: number = 5;
    private m_ascii = 97;
    private rar: Letter;
    private m_fader = new Array();
    private m_faderCounter:number = 1;
    private m_bollo: number = 0;

    constructor(element: HTMLElement) {
        this.init();
    }

    private init(): void {
        this.m_canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.m_ctx = this.m_canvas.getContext("2d");

        var fontImage: HTMLImageElement = <HTMLImageElement>document.getElementById("font");
        this.m_blockImage = <HTMLImageElement>document.getElementById("block");

        // Get the data from the texture
        var imagedata = this.GetImageData(fontImage);
        var pixelData = imagedata.data;

        // stride = the image width
        var temp = [];
        var count = 0;
        for (var a = 1; a < 27; a++) {
            for (var y = 0; y < this.m_letterHeight; y++) {
                for (var x = count; x < count + this.m_letterWidth * 4; x += 4) {
                    // RGB elements are combined & the alpha value is skipped
                    var g = ((pixelData[x + 0] + pixelData[x + 1] + pixelData[x + 2]) / 3);
                    if (g != 255) {
                        temp.push(1);
                    }
                    else {
                        temp.push(0);
                    }
                }
                //Nudge the counter along to the next row of the letter
                count += fontImage.width * 4;
                this.font.push(temp);
                temp = [];
            }
            //Reset the counter to the start of the next letter
            count = a * (this.m_letterWidth * 4);
            this.rar = new Letter(this.font, this.m_ascii++);
            this.m_letterCollection.push(this.rar);
            this.font = [];
        }

        var fad = 0;
        for (var fd = 1; fd < 201; fd++) {
            this.m_fader[fd] = fad;
            fad += 0.01;
            if (fad >= 1) {
                fad = 1;
            }
        }
        for (var fd = 201; fd < 301; fd++) {
            this.m_fader[fd] = fad;
            fad -= 0.01;
            if (fad <= 0) {
                fad = 0;
            }
        }

        this.m_ctx.globalAlpha = 0;
    }

    // Function to extract the data from the Image
    private GetImageData(image) {
        // set the stride width to the image width * 4 bytes
        this.m_stride = image.width * 4;

        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height);
    }


    public update(): void {

        this.m_ctx.fillStyle = "black";
        this.m_ctx.clearRect(0, 0, 800, 600);

        this.m_ctx.beginPath();
        var p = 0;
        for (var a = 0; a < this.m_text.length; a++) {
            var lett = this.m_text.charCodeAt(a);
            for (var b = 0; b < this.m_letterCollection.length; b++) {
                if (this.m_letterCollection[b].asciiCode == lett) {
                    var ront = this.m_letterCollection[b].block;
                    this.drawBlocks(p, ront);
                    p += 80;//100
                }
            }
        }
    }

    private drawBlocks(spacing: number, relic) {
        this.m_bollo += 0.08;
        if (this.m_bollo > 2) {
            var alf: number = this.m_fader[this.m_faderCounter]; 
            this.m_ctx.globalAlpha = alf;
            this.m_bollo = 0;
            this.m_faderCounter += 1;
        }
        for (var x = 0; x < this.m_letterHeight; x++) {
            for (var i = 0; i < this.m_letterWidth; i++) {
                if (relic[x][i] == 1) {
                    this.m_ctx.drawImage(this.m_blockImage, i * this.m_scaleX + this.m_scroll + spacing, x * this.m_scaleY, this.m_scaleX, this.m_scaleY);
                }
            }
        }
    }
}

window.onload = () => {
    var el = document.getElementById('content');
    var mess = new Mess(el);
    setInterval(() => mess.update(), 13);
};
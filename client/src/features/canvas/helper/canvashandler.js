import { DrawingBoard } from "./main";

DrawingBoard.prototype.clearcanvas = () => {
    try {
        this.canvasdata.x = 0,
            this.canvasdata.y = 0,
            this.canvasdata.scale = 1,
            this.canvasdata.height = window.innerHeight,
            this.canvasdata.width = window.innerWidth,
            this.canvasdata.maxscale = 2,
            this.canvasdata.minscale = 0.2,
            this.canvasdata.scaleunit = 0.1,
            this.canvasdata.background = 'white',
            this.canvasdata.currentmode = 0
    } catch (error) {
        console.log(error)
    }
}
DrawingBoard.prototype.addcanvas = (obj) => {
    try {
        if (!obj || typeof obj !== 'object') return;
        Object.keys(obj).forEach(key => {
            if (key === 'backgrond') {
                this.canvasdata[key] = obj[key];
            } else {
                this.canvasdata[key] = Number(obj[key]);
            }
        });

    } catch (error) {
        console.log(error)
    }
}
DrawingBoard.prototype.move = ({ x, y }) => {
    try {
        this.canvasdata.x += x;
        this.canvasdata.y += y;

    } catch (error) {
        console.log(error)
    }
}
DrawingBoard.prototype.changeMode = (mode) => {
    try {
        this.canvasdata.currentmode = mode;
    } catch (error) {
        console.log(error)
    }
}
DrawingBoard.prototype.upscale = () => {
    try {
        if (this.canvasdata.scale >= this.canvasdata.maxscale) return;
        this.canvasdata.scale += this.canvasdata.scaleunit;
    } catch (error) {
        console.log(error)
    }
}
DrawingBoard.prototype.downscale = () => {
    try {
        if (this.canvasdata.scale <= this.canvasdata.minscale) return;
        this.canvasdata.scale -= this.canvasdata.scaleunit;
    } catch (error) {
        console.log(error)
    }
}
DrawingBoard.prototype.changebackground = (background) => {
    try {
        this.canvasdata.background = background;
    } catch (error) {
        console.log(error)
    }
}
DrawingBoard.prototype.createBoard = function() {
    try {
        const context = this.canvasdata.canvas.getContext('2d');
        context.setTransform(1, 0, 0, 1, 0, 0);
        this.clearBoard(context);
        context.translate(this.canvasdata.x, this.canvasdata.y);
        context.fillStyle = "white";
        context.fillRect(0, 0, this.canvasdata.width * this.canvasdata.scale, this.canvasdata.height * this.canvasdata.scale);
        this.canvasdata.canvascopy && context.putImageData(this.canvasdata.canvascopy,0,0);

    } catch (error) {
        console.log(error);
        handler(500)
    }
}

DrawingBoard.prototype.clearBoard = function(CTX){
    CTX.clearRect(0,0,this.canvasdata.width, this.canvasdata.height);
}

// DrawingBoard.prototype.draw = () => {
//     try {
//         const canv = self.canvasdata.canvas;
//         if (!canv) return;
//         this.createBoard(canv);
//         const context = canv.getContext('2d');
//         let arr = SHAPE.pages[PAGE - 1];
//         arr.map((i) => {
//             const { shape, linewidth, color, prev, id } = SHAPE.store[i];
//             let draw = true;
//             if (SHAPE.select && SHAPE.select.id === id) draw = false;
//             if (draw) {
//                 if (shape === 'line') {
//                     context.beginPath()
//                     context.lineCap = 'round';
//                     context.lineJoin = 'round';
//                     context.strokeStyle = color;
//                     context.lineWidth = linewidth * SCALE;
//                     context.moveTo(prev[0].x * SCALE, prev[0].y * SCALE)
//                     for (let i = 1; i < prev.length; i++) {
//                         context.lineTo(prev[i].x * SCALE, prev[i].y * SCALE);
//                         context.stroke();
//                     }
//                     context.closePath();
//                 }

//             }
//         })

//     } catch (error) {
//         console.log(error);
//         handler(500)
//     }
// }

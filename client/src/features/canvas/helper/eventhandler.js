import { DrawingBoard } from "./main";
import { handler } from "../../../helper/handler";
import { v4 } from "uuid";

/*
{
border: {x: 374, y: 249, h: 341, w: 428}
color: "black"
id: "20bc281c-eac6-4cac-ad06-a5132a10b651"
linewidth: 10
prev: (31) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
shape: "line"
}
*/

DrawingBoard.prototype.handletouchstart = () => {
    try {
        let x, y;
        let touch = e.touches[0];
        x = touch.pageX;
        y = touch.pageY;
        this.update({ x, y });
        this.overCanvasredraw();
        switch (MODE) {
            case 0:
                setdraw(true);
                break;

            case 1:
                let x1 = (x - this.canvasdata.x) / this.canvasdata.scale;
                let y1 = (y - this.canvasdata.y) / this.canvasdata.scale;
                this.select({ x: x1, y: y1 });
                this.draw();
                // sethold(true);

                break;

            case 2:
                // setmoving(true);
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

DrawingBoard.prototype.handledown = function(e){
    try {
        let x, y;
        x = e.clientX;
        y = e.clientY;
        
        // this.overCanvasredraw();
        switch (this.canvasdata.currentmode) {
            case 0:
                {
                    let x1 = (x - this.canvasdata.x) / this.canvasdata.scale;
                    let y1 = (y - this.canvasdata.y) / this.canvasdata.scale;
                    this.shapedata.linedata.push({x:x1,y:y1});
                    this.shapedata.border = {x:x1,y:y1,width:x1,height:y1};
                    const context = this.canvasdata.canvas.getContext('2d');
                    context.beginPath();
                    context.lineCap = 'round';
                    context.lineJoin = 'round';
                    context.strokeStyle = this.shapedata.color;
                    context.lineWidth = this.shapedata.linewidth * this.canvasdata.scale;
                    context.fillStyle = this.shapedata.color;
                    context.arc(x1,y1,this.shapedata.linewidth * this.canvasdata,0,Math.PI * 2);
                    context.closePath();
                    context.fill();
                    context.stroke();
                }
                // setdraw(true);
                break;

            case 1:
                {

                    let x1 = (x - this.canvasdata.x) / this.canvasdata.scale;
                    let y1 = (y - this.canvasdata.y) / this.canvasdata.scale;
                    this.select({ x: x1, y: y1 });
                    this.draw();
                    this.overCanvasredraw()
                    // sethold(true);
                }

                break;

            case 2:
                // setmoving(true);
                this.canvasdata.canvasmove = true;
                break;
        }
    } catch (err) {
        console.log(err);
        handler(500)
    }

}

DrawingBoard.prototype.handletouchend =()=>{
    
}

DrawingBoard.prototype.handleup = function(){
    try {
        switch (this.canvasdata.currentmode) {
            case 0:
                if (this.shapedata.linedata.length > 0) {
                    const newval = this.shapedata.pages[this.shapedata.pages.length - 1 ];
                    let id = v4();
                    this.shapedata.store.set(id,{
                        id,
                        color: this.shapedata.color,
                        prev:this.shapedata.linedata,
                        linewidth:this.shapedata.linewidth,
                        shape:'line',
                        border: this.shapedata.border
                    })
                    newval.push(id);
                    this.shapedata.pages.push(newval);
                    this.shapedata.linedata = [];
                    this.shapedata.border = {x:0,y:0,width:0,height:0}
                    // const ctx = this.canvasdata.canvas.getContext('2d');
                    // this.canvasdata.canvascopy = ctx.getImageData(this.canvasdata.x,this.canvasdata.y,this.canvasdata.width, this.canvasdata.height)
                }
                break;

            case 1:
                if(this.shapedata.select){
                    this.shapedata.select = null;
                    this.draw();
                }
                break;

            case 2:
                if(this.canvasdata.canvasmove) this.canvasdata.canvasmove = false;
                break;
        }
    } catch (error) {
        console.log(error);
        handler(500)
    }
};


DrawingBoard.prototype.handleMove = function(e){
    try {
        let x, y;
        
            x = e.clientX;
            y = e.clientY;

        switch (this.canvasdata.currentmode) {
            case 0:
                {
                    if(this.shapedata.linedata.length <= 0) return;
                    let x1 = (x - this.canvasdata.x) / this.canvasdata.scale;
                    let y1 = (y - this.canvasdata.y) / this.canvasdata.scale;
                    this.shapedata.linedata.push({x:x1,y:y1});
                    if(x1 < this.shapedata.border.x){
                        this.shapedata.border.x = x1;
                    }
                    if(y1 < this.shapedata.border.y){
                        this.shapedata.border.y = y1;
                    }
                    if(y1 > this.shapedata.border.height){
                        this.shapedata.border.height = y1;
                    }
                    if(x1 > this.shapedata.border.width){
                        this.shapedata.border.width = x1;
                    }
                    
                    const context = this.canvasdata.canvas.getContext('2d');
                    context.beginPath();
                    context.lineCap = 'round';
                    context.lineJoin = 'round';
                    context.strokeStyle = this.shapedata.color;
                    context.lineWidth = this.shapedata.linewidth * this.canvasdata.scale;
                    context.moveTo(this.shapedata.linedata[this.shapedata.linedata.length-2].x,this.shapedata.linedata[this.shapedata.linedata.length-2].y);
                    context.lineTo(x1,y1);
                    context.closePath();
                    context.stroke(); 
                }
                break;

            case 1:
                if (this.shapedata.select) {
                    let i = e.movementX;
                    let j = e.movementY;
                    this.updateLine(i,j);
                    this.overCanvasredraw();
                }
                break;

            case 2:
                if (this.canvasdata.canvasmove) {
                    this.move({ x: e.movementX, y:e.movementY });
                    // dispatch(move());
                    this.createBoard();
                    // this.draw();
                }
                break;
        }

    } catch (error) {
        console.log(error);
        handler(500)
    }
};

DrawingBoard.prototype.handletouchmove = (e) => {
    let x,y;
    let touch = e.touches[0];
    x = touch.pageX;
    y = touch.pageY;

    switch (MODE) {
        case 0:
            if (freedraw) {
                DrawLine(x, y, CANVAS.x, CANVAS.y, SCALE, overCanvasRef.current, SHAPE.color, SHAPE.linewidth, line, lineborder);
            }
            break;

        case 1:
            if (hold && SHAPE.select) {
                dispatch(updateLine({ i: x - mouse.x, j: y - mouse.y }));
                overCanvasredraw()
            }
            break;

        case 2:
            if (canvasmove) {
                dispatch(move({ x: x - mouse.x, y: y - mouse.y }));
                createBoard(canvasRef.current);
            }
            break;
    }

}

export default DrawingBoard
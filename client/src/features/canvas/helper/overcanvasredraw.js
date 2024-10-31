import { handler } from "../../../helper/handler";
import  {DrawingBoard}  from "./main";


DrawingBoard.prototype.overCanvasredraw = () => {
    try {
        
        const overcanvas = this.canvasdata.overcanvas;
        const overcontext = overcanvas.getContext('2d');
        overcontext.setTransform(1, 0, 0, 1, 0, 0);
        overcontext.clearRect(0, 0, window.innerWidth, window.innerHeight)

        overcontext.translate(this.canvasdata.x, this.canvasdata.y);
        // const move_elem = moveref.current;
        // move_elem.style.height = `${0}px`;
        // move_elem.style.width = `${0}px`;
        // move_elem.style.top = `${0}px`;
        // move_elem.style.left = `${0}px`;
        if (this.shapedata.select) {


            const { border } = SHAPE.select;
            // move_elem.style.height = `${(border.h - border.y) * SCALE}px`;
            // move_elem.style.width = `${(border.w - border.x) * SCALE}px`;
            // move_elem.style.top = `${(border.y * SCALE) + CANVAS.y}px`;
            // move_elem.style.left = `${(border.x * SCALE) + CANVAS.x}px`;

            const { shape, linewidth, color, prev, id } = this.shapedata.select;
            if (shape === 'line') {
                overcontext.beginPath();
                overcontext.lineWidth = linewidth * SCALE;
                overcontext.strokeStyle = color;
                overcontext.lineCap = 'round';
                overcontext.lineJoin = 'round';
                for (let i = 0; i < prev.length; i++) {
                    overcontext.lineTo(prev[i].x * SCALE, prev[i].y * SCALE);
                    overcontext.stroke();
                }
                overcontext.closePath();
            }

        }
    } catch (error) {
        console.log(error);
        handler(500)
    }

}

export default DrawingBoard;
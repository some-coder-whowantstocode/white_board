import { DrawingBoard } from "./main";

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

DrawingBoard.prototype.handledown = (e) => {
    try {
        let x, y;
        x = e.clientX;
        y = e.clientY;

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
    } catch (err) {
        console.log(err);
        handler(500)
    }

}

DrawingBoard.prototype.handletouchend =()=>{
    
}

DrawingBoard.prototype.handleup = () => {
    try {
        switch (MODE) {
            case 0:
                // setdraw(false);
                if (this.line.prev.length > 0) {
                    dispatch(addLine({ prev: line.current, border: lineborder.current }));
                    line.current = [];
                    lineborder.current = { x: 0, y: 0, w: 0, h: 0 }
                    const overcontext = overcanvas.getContext('2d');
                    clearBoard(overcontext);
                    draw();
                }

                break;

            case 1:
                sethold(false);

                dispatch(release());
                if (hold) {
                    draw();
                }
                break;

            case 2:
                setmoving(false);
                canvasmove && draw();
                break;
        }
    } catch (error) {
        console.log(error);
        handler(500)
    }
};


DrawingBoard.prototype.handleMove = (e, type) => {
    try {
        let x, y;
        if (type === 'touch') {
            let touch = e.touches[0];
            x = touch.pageX;
            y = touch.pageY;
            dispatch(update({ x, y }));
        } else {
            x = e.clientX;
            y = e.clientY;
        }

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

        if (type !== 'touch') dispatch(update({ x, y }));
    } catch (error) {
        console.log(error);
        handler(500)
    }
};

DrawingBoard.prototype.handletouchmove = (e) => {
    e.preventDefault();
    handleMove(e, 'touch');
}

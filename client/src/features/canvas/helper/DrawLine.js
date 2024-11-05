import { handler } from "../../../helper/handler";
import DrawingBoard from "./main";

DrawingBoard.prototype.DrawLine = function(){
    try{
        let x = (initx -  canvasx )/scale , y = (inity- canvasy)/scale  ;
        const overcontext = canvas.getContext('2d')
        overcontext.beginPath()
        overcontext.lineCap = 'round';
        overcontext.lineJoin = 'round';
        overcontext.strokeStyle = color;
        overcontext.lineWidth = linewidth * scale;
        if(line.current.length >0){
            let lastdot = line.current[line.current.length-1];
            let lastx = (lastdot.x)*scale, lasty = (lastdot.y )*scale
            overcontext.moveTo(lastx,lasty);
        }else{
            lineborder.current.x = x;
            lineborder.current.y = y;
            lineborder.current.w = x;
            lineborder.current.h = y;
        }
        overcontext.lineTo(initx - canvasx,inity-canvasy);
        line.current.push({x,y});
        let border = lineborder.current;
        if(x < border.x) border.x = x;
        if(y < border.y) border.y = y;
        if(x > border.w) border.w = x;
        if(y > border.h) border.h = y;
        lineborder.current = border;
        overcontext.closePath()
        overcontext.stroke();
    }catch(err){
        console.log(err);
        handler(500,"something went wrong.");
    }
    
    };

export default DrawingBoard
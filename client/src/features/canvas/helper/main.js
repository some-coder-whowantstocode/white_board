function DrawingBoard () {
    this.canvasdata={
        canvas:null,
        overcanvas:null,
        x:0,
        y:0,
        scale:1,
        height:innerHeight,
        width:innerWidth,
        maxscale:Number.MAX_SAFE_INTEGER,
        minscale:0.2,
        scaleunit:0.1,
        background:'white',
        modes:['draw','move','cursor','shapes'],
        currentmode:0,
        canvascopy:null,
        canvasmove:false,
        imagedata:null
    },
    this.shapedata={
        linewidth:10,
        store:new Map(),
        color:'black',
        size:30,
        lineid:null,
        currentPage:1,
        maxpages:1,
        minpages:1,
        select:null,
        pages:[[]],
        linedata:[],
        border:{ x:0, y:0 ,width:0 ,height:0 }
    },
    this.cursordata={
        x:0,
        y:0,
        movex:0,
        movey:0,
        lastx:0,
        lasty:0
    }
}
export default DrawingBoard
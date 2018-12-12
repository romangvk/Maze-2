// Roman Kasparian, Rahul Madala 2015
function gelem(id) {return document.getElementById(id)}
function canvas() {return gelem("maze")}
function context() {return canvas().getContext("2d")}

var render
var mazeWalls = []
var mousePos = []
var colorUnderMouse = "#000000"
var level = 0
var width
var height
var loseAud = new Audio('lose.wav');
var finishAud = new Audio('finish.wav');

function setup() {
    resize()
    width = canvas().width
    height = canvas().height
    render = setInterval("redraw()", 30)
    canvas().setAttribute("onclick", "nextLevel(); canvas().setAttribute(\"onclick\", \"\"); ")
}
function getCoords(evt) {
    x = evt.clientX
    y = evt.clientY
    mousePos = [x, y]
    var p = context().getImageData(x, y, 1, 1).data; 
    colorUnderMouse = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function resize() {
    var ctx = context()
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
    width = canvas().width
    height = canvas().height
    if(level > 1) {mazeWalls = createMaze()}
}
function clearCanvas() {
    context().clearRect(0, 0, canvas().width, canvas().height)
}
var hue = 0
function lineColor(v) {
    hue+=2
    if(hue > 360) {
        hue = 0
    }
    return "hsl(" + hue + ", 100%, " + v + "%)"
}
function nextLevel() {
    level++
    if(level > 1) {mazeWalls = createMaze()}
}
var finish = 0
function redraw() {
    clearCanvas()
    var color = lineColor(50)
    if(level == 0) {
        // Menu
        var titleCtx = context()
        titleCtx.font = "100px Arial"
        titleCtx.strokeStyle = color
        titleCtx.lineWidth = "3"
        titleCtx.strokeText("Maze 2: Electric Boogaloo", canvas().width/2, canvas().height/8)
        titleCtx.textAlign = "center"
        titleCtx.shadowBlur = 15
        titleCtx.shadowColor = color
        titleCtx.shadowOffsetX = 0
        titleCtx.shadowOffsetY = 0
        titleCtx.stroke()

        var arc2 = context()
        arc2.beginPath()
        arc2.arc(canvas().width/2, 3*canvas().height/5, canvas().height/10, Math.PI/4, Math.PI*3/4)
        arc2.strokeStyle = color
        arc2.lineWidth = "9"
        arc2.shadowBlur = 15
        arc2.shadowColor = color
        arc2.shadowOffsetX = 0
        arc2.shadowOffsetY = 0
        arc2.stroke()
        var arc1 = context()
        arc1.beginPath()
        arc1.arc(canvas().width/2, 3*canvas().height/5, canvas().height/10, Math.PI*5/4, Math.PI*7/4)
        arc1.strokeStyle = color
        arc1.lineWidth = "9"
        arc1.shadowBlur = 15
        arc1.shadowColor = color
        arc1.shadowOffsetX = 0
        arc1.shadowOffsetY = 0
        arc1.stroke()

        var startCtx = context()
        startCtx.font = "50px Arial"
        startCtx.strokeStyle = color
        startCtx.lineWidth = "3"
        startCtx.strokeText("click to start", canvas().width/2, 3*canvas().height/5 + 15)
        startCtx.textAlign = "center"
        startCtx.shadowBlur = 15
        startCtx.shadowColor = color
        startCtx.shadowOffsetX = 0
        startCtx.shadowOffsetY = 0
        startCtx.stroke()
    }
    else if(level == 1) {
        if(mousePos[0] == 0) {
            nextLevel()
            finish = width-1
        }
        // Instructions
        var ctx = context()
        ctx.beginPath()
        ctx.font = "50px Arial"
        ctx.strokeStyle = color
        ctx.lineWidth = "3"
        ctx.strokeText("move your cursor to the left of the screen", canvas().width/2, canvas().height/2)
        ctx.textAlign = "center"
        ctx.shadowBlur = 15
        ctx.shadowColor = color
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.stroke()
    }
    else {
        if(parseInt(colorUnderMouse.slice(1), 16) != 0) {
            level = 0
            canvas().setAttribute("onclick", "nextLevel(); canvas().setAttribute(\"onclick\", \"\"); ")
            loseAud.play();
        }
        if(mousePos[0] == finish) {
            nextLevel()
            if(finish == 0)
                finish = width-1
            else
                finish = 0
            finishAud.play();
        }
        //console.log(mazeWalls.length)
        for(var i = 0; i < mazeWalls.length; i++) {
            //console.log("wall " + i)
            var ctx = context()
            ctx.beginPath()
            ctx.moveTo(mazeWalls[i][0][0], mazeWalls[i][0][1])
            ctx.lineTo(mazeWalls[i][1][0], mazeWalls[i][1][1])
            ctx.strokeStyle = color
            ctx.lineWidth = "" + size/2
            ctx.lineCap = "round"
            ctx.shadowColor = 'transparent'
            ctx.stroke()
        }
    }
}

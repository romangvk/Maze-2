var gridWidth
var gridHeight
var size
function createMaze() {
    size = height/level
    gridWidth = Math.floor(width/size)
    gridHeight = level

    // Create edge lists
    var horiz = []
    var verti = []
    for(var i = 0; i < gridWidth*(gridHeight+1); i++) {horiz.push(0)}
    for(var i = 0; i < (gridWidth+1)*gridHeight; i++) {verti.push(0)}
    
    // Outer walls
    // Top edge
    for(var i = 0; i < gridWidth; i++) {horiz[i] = 1}
    // Bottom edge
    for(var i = 0; i < gridWidth; i++) {horiz[horiz.length-1-i] = 1}
    // Right edge
    for(var i = gridWidth; i < (gridWidth+1)*gridHeight; i+=(gridWidth+1)) {verti[i] = 1}
    // Left edge
    for(var i = 0; i < (gridWidth+1)*gridHeight; i+=(gridWidth+1)) {verti[i] = 1}
    // end
    
    // Create walls at random
    for(var i = 0; i < (horiz.length+verti.length)*3; i++) {
        var h = Math.floor(Math.random()*horiz.length)
        // Check for dead end
        if(!deadEnd(h, 1, horiz, verti)) {horiz[h] = 1}

        var v = Math.floor(Math.random()*verti.length)
        // Check for dead end
        if(!deadEnd(v, 0, horiz, verti)) {verti[v] = 1}
    }

    // Fill holes
    for(var i = 0; i < horiz.length; i++) {
        if(!deadEnd(i, 1, horiz, verti)) {
            horiz[i] = 1
        }
    }
    for(var i = 0; i < verti.length; i++) {
        if(!deadEnd(i, 0, horiz, verti)) {
            verti[i] = 1
        }
    }

    // Connect all paths
    var cells = []
    for(var i = 0; i < gridWidth*gridHeight; i++) {
        cells.push(0)
    }
    // Starting at the first cell, flood fill and label sections
    var label = 1
    var first0 = cells.indexOf(0)
    while(first0 >= 0) {
        var is = [first0]
        while(is.length) {
            var i = is.pop()
            cells[i] = label
            if(canGo(i, 0, cells, horiz, verti)) {
                is.push(i-gridWidth)
            }
            if(canGo(i, 1, cells, horiz, verti)) {
                is.push(i+1)
            }
            if(canGo(i, 2, cells, horiz, verti)) {
                is.push(i+gridWidth)
            }
            if(canGo(i, 3, cells, horiz, verti)) {
                is.push(i-1)
            }
        }
        label++
        first0 = cells.indexOf(0)
    }
    for(var h = gridWidth; h < horiz.length-gridWidth; h++) {
        var topCell = h - gridWidth
        var bottomCell = h
        if(cells[topCell] != 'undefined' && cells[bottomCell] != 'undefined' && cells[topCell] != cells[bottomCell]) {
            horiz[h] = 0
            var labels = [cells[topCell], cells[bottomCell]]
            labels.sort()
            for(var c = 0; c < cells.length; c++) {
                if(cells[c] == labels[1]) {cells[c] = labels[0]}
            }
        }
    }
    for(var v = 1; v < verti.length-1; v++) {
        if((v+1)%(gridWidth+1)%(v+1) < 2) {continue}
        var leftCell = Math.floor(v/(gridWidth+1))*gridWidth + v%(gridWidth+1)-1
        var rightCell = Math.floor(v/(gridWidth+1))*gridWidth + v%(gridWidth+1)
        if(cells[leftCell] != 'undefined' && cells[rightCell] != 'undefined' && cells[leftCell] != cells[rightCell]) {
            verti[v] = 0
            var labels = [cells[leftCell], cells[rightCell]]
            labels.sort()
            for(var c = 0; c < cells.length; c++) {
                if(cells[c] == labels[1]) {cells[c] = labels[0]}
            }
        }
    }
    
    // Make start and end
    if(mousePos[0] == 0) {
        verti[Math.floor(mousePos[1]/height*gridHeight)*(gridWidth+1)] = 0
        verti[Math.floor(Math.random()*gridHeight)*(gridWidth+1)+gridWidth] = 0
    }
    else if(mousePos[0] == finish) {
        verti[Math.floor(mousePos[1]/height*gridHeight)*(gridWidth+1)+gridWidth] = 0
        verti[Math.floor(Math.random()*gridHeight)*(gridWidth+1)] = 0
    }
    var walls = drawableGrid(horiz, verti)
    return walls
}
// Roman Kasparian, Rahul Madala 2015
function canGo(i, dir, cells, horiz, verti) {
    var x = i%gridWidth
    var y = Math.floor(i/gridWidth)
    if(dir == 0) {return horiz[x+gridWidth*y] != 1 && cells[i-gridWidth] == 0}
    else if(dir == 1) {return verti[1+x+(gridWidth+1)*y] != 1 && cells[i+1] == 0}
    else if(dir == 2) {return horiz[x+gridWidth*(y+1)] != 1 && cells[i+gridWidth] == 0}
    else {return verti[x+(gridWidth+1)*y] != 1 && cells[i-1] == 0}
}
function deadEnd(i, horv, horiz, verti) {
    if(horv) {
        var h1 = i-gridWidth
        var v11 = (Math.floor(i/gridWidth)-1)*(gridWidth+1)+(i%gridWidth)
        var v12 = (Math.floor(i/gridWidth)-1)*(gridWidth+1)+(i%gridWidth)+1
        //console.log(h+" "+h1+" "+v11+" "+v12)
        if(horiz[h1] + verti[v11] + verti[v12] > 1)
            return true
        var h2 = i+gridWidth
        var v21 = Math.floor(i/gridWidth)*(gridWidth+1)+(i%gridWidth)
        var v22 = Math.floor(i/gridWidth)*(gridWidth+1)+(i%gridWidth)+1
        //console.log(h+" "+h2+" "+v21+" "+v22)
        if(horiz[h2] + verti[v21] + verti[v22] > 1)
            return true
    }
    else {
        var v1 = i-1
        var h11 = i-Math.floor(i/gridWidth)-1
        var h12 = i-Math.floor(i/gridWidth)-1+gridWidth
        //console.log(v+" "+v1+" "+h11+" "+h12)
        if(verti[v1] + horiz[h11] + horiz[h12] > 1)
            return true
        var v2 = i+1
        var h21 = i-Math.floor(i/gridWidth)
        var h22 = i-Math.floor(i/gridWidth)+gridWidth
        //console.log(v+" "+v2+" "+h21+" "+h22)
        if(verti[v2] + horiz[h21] + horiz[h22] > 1)
            return true
    }
    return false
}
function drawableGrid(horiz, verti) {
    var walls = []
    var xOffset = Math.floor((width%size)/2)
    // Horizontal walls
    for(var i = 0; i < horiz.length; i++) {
        if(horiz[i])
            walls.push([[Math.floor((i%gridWidth)*size+xOffset), Math.floor(i/gridWidth)*size], [Math.floor((i%gridWidth+1)*size+xOffset), Math.floor(i/gridWidth)*size]])
    }
    // Vertical walls
    for(var i = 0; i < verti.length; i++) {
        if(verti[i])
            walls.push([[Math.floor((i%(gridWidth+1))*size+xOffset), Math.floor(i/(gridWidth+1))*size], [Math.floor((i%(gridWidth+1))*size+xOffset), Math.floor((i/(gridWidth+1))+1)*size]])
    }
    return walls
}

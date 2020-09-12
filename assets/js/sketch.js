
const resetSound = new Audio('./assets/sound/reset.ogg');
const drawingSound = new Audio('./assets/sound/drawloop.ogg');

var initialized = false;
var isDrawing = false;
var isEraser = false;
var x = 0;
var y = 0;
var strokeWidth = 6;
var strokeColor = 'white';
var eraserButton;
var pencilButton;
var thinStrokeButton;
var thickStrokeButton;
var selectedButton;
var inactiveButton;
var canvasRect;

function playButtonSound()
{
    resetSound.currentTime = 0;
    resetSound.play();
}

function resetCanvas()
{
    var canvas = document.getElementById('canvas');
    eraserButton = document.getElementById('eraser');
    pencilButton = document.getElementById('pencil');
    thinStrokeButton = document.getElementById('thinstroke');
    thickStrokeButton = document.getElementById('largestroke');
    selectedButton = document.getElementById('selected-colors');
    inactiveButton = document.getElementById('inactive-colors');
    canvasRect = document.getElementById('canvas-bg');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight
    drawCanvas();
    isDrawing = false;
    isEraser = false;
}

function selectTool(toolIndex)
{
    if(toolIndex === 0)
    {
        pencilButton.style.backgroundColor = window.getComputedStyle(selectedButton).getPropertyValue('background-color');
        eraserButton.style.backgroundColor = inactiveButton.style.backgroundColor;
        strokeColor = 'black';
    }
    if(toolIndex === 1)
    {
        pencilButton.style.backgroundColor = inactiveButton.style.backgroundColor;
        eraserButton.style.backgroundColor = window.getComputedStyle(selectedButton).getPropertyValue('background-color');
        strokeColor = window.getComputedStyle(canvasRect).getPropertyValue('background-color');
    }
}

function setSize(size)
{
    if(size === 0)
    {
        thinStrokeButton.style.backgroundColor = window.getComputedStyle(selectedButton).getPropertyValue('background-color');
        thickStrokeButton.style.backgroundColor = inactiveButton.style.backgroundColor;
        strokeWidth = 6;
    }

    if(size === 1)
    {
        thinStrokeButton.style.backgroundColor = inactiveButton.style.backgroundColor;
        thickStrokeButton.style.backgroundColor = window.getComputedStyle(selectedButton).getPropertyValue('background-color');
        strokeWidth = 16;
    }
}

function drawCanvas()
{
    var canvas = document.getElementById('canvas');

    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d'); 
    }

    function getPosition(event)
    { 
        x = event.clientX - canvas.offsetLeft; 
        y = event.clientY - canvas.offsetTop; 
    } 

    function sketchStart(canvas, event) 
    {
        drawingSound.volume = 0.25;
        drawingSound.loop = true;
        drawingSound.play();
        getPosition(event);
        drawCircle(x,y,strokeWidth * 0.5);
    }

    function sketch(context, event)
    {
        if(!isDrawing)
            return;
        
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.moveTo(x, y);
        getPosition(event);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function drawCircle(X,Y,R)
    {
        ctx.beginPath();
        ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
        ctx.fillStyle = strokeColor;
        ctx.fill();
    }

    if(!initialized)
    {
        window.addEventListener("resize", resetCanvas);
        canvas.addEventListener('mousedown', function(e) { isDrawing = true; sketchStart(canvas, e); })
        canvas.addEventListener('mouseup', function(e){ isDrawing = false; drawingSound.pause(); drawingSound.currentTime = 0; })
        canvas.addEventListener('mousemove', function(e){ sketch(canvas, e); });
        initialized = true;
        resetCanvas();
        setSize(0);
        selectTool(0);
    }
}
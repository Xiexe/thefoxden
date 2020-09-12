var initialized = false;
var isDrawing = false;
var isEraser = false;
let x = 0;
let y = 0;
var strokeWidth = 6;
var strokeColor = 'white';
var resetSound = new Audio('./assets/sound/reset.ogg');
var drawingSound = new Audio('./assets/sound/drawloop.ogg');

function playButtonSound()
{
    resetSound.currentTime = 0;
    resetSound.play();
}

function resetCanvas()
{
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight
    drawCanvas();
    isDrawing = false;
    isEraser = false;
    setSize(0);
    selectTool(0);
}

function selectTool(toolIndex)
{
    if(toolIndex === 0)
        strokeColor = 'white';
    if(toolIndex === 1)
        strokeColor = 'black';
}

function setSize(size)
{
    if(size === 0)
        strokeWidth = 6;
    if(size === 1)
        strokeWidth = 16;
}

function drawCanvas()
{
    var canvas = document.getElementById('canvas');

    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d'); 
        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    }
}
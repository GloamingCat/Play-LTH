var canvas = document.getElementById("canvas");
var loadingCanvas = document.getElementById('loadingCanvas');
var loadingContext = loadingCanvas.getContext('2d');
var startButton = document.getElementById('play');
var resumeButton = document.getElementById('resume');

var applicationLoad = function(e) {
    startButton.style.display = 'inline';
}

function goFullScreen() {
    if(canvas.requestFullScreen)
        canvas.requestFullScreen();
    else if(canvas.webkitRequestFullScreen)
        canvas.webkitRequestFullScreen();
    else if(canvas.mozRequestFullScreen)
        canvas.mozRequestFullScreen();
    switch (screen.orientation) {
        case "portrait-secondary":
        case "portrait-primary":
            screen.orientation.lock("landscape-primary");
    }
}

function loadGame() {
    startButton.style.display = 'none';
    loadingCanvas.style.visibility = 'visible';
    Love(Module);
}

function drawLoadingText(text) {
    loadingContext.fillStyle = "rgb(142, 195, 227)";
    loadingContext.fillRect(0, 0, loadingCanvas.scrollWidth, loadingCanvas.scrollHeight);

    loadingContext.font = '2em arial';
    loadingContext.textAlign = 'center'
    loadingContext.fillStyle = "rgb( 11, 86, 117 )";
    loadingContext.fillText(text, loadingCanvas.scrollWidth / 2, loadingCanvas.scrollHeight / 2);

    loadingContext.fillText("Powered By Emscripten.", loadingCanvas.scrollWidth / 2, loadingCanvas.scrollHeight / 4);
    loadingContext.fillText("Powered By LÖVE.", loadingCanvas.scrollWidth / 2, loadingCanvas.scrollHeight / 4 * 3);
}

window.onload = function () { window.focus(); };
//window.onclick = function () { window.focus(); };
    
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
        e.preventDefault();
}, false);
    
window.onfullscreenchange = function(e) {
    console.log("fullscreen event");
    if (document.fullscreenElement) {
        console.log("Fullscreen");
        canvas.style.visibility = 'visible';
        resumeButton.style.display = 'none';
    } else {
        console.log("Pause");
        canvas.style.visibility = 'hidden';
        resumeButton.style.display = 'inline';
    }
};

window.onresize = window.onfullscreenchange;

var Module = {
    arguments: ["./game.love"],
    INITIAL_MEMORY: 16777216,
    printErr: console.error.bind(console),
    canvas: (function() {
        // As a default initial behavior, pop up an alert when webgl context is lost. To make your
        // application robust, you may want to override this behavior before shipping!
        // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
        canvas.addEventListener("webglcontextlost", function(e) { alert('WebGL context lost. You will need to reload the page.'); e.preventDefault(); }, false);
            return canvas;
    })(),
    setStatus: function(text) {
        if (text) {
            drawLoadingText(text);
        } else if (Module.remainingDependencies === 0) {
            loadingCanvas.style.display = 'none';
            goFullScreen();
        }
    },
    totalDependencies: 0,
    remainingDependencies: 0,
    monitorRunDependencies: function(left) {
        this.remainingDependencies = left;
        this.totalDependencies = Math.max(this.totalDependencies, left);
        Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
    }
};

Module.setStatus('Downloading...');
window.onerror = function(e) {
    // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
    Module.setStatus('Exception thrown, see JavaScript console');
    Module.setStatus = function(text) {
        if (text)
            Module.printErr('[post-exception status] ' + text);
    };
};
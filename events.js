var canvas = document.getElementById("canvas");
var loadingText = document.getElementById('loadingText');
var startButton = document.getElementById('play');
var resumeButton = document.getElementById('resume');

function applicationLoad() {
    //startButton.style.display = 'inline';
    Love(Module);
}

/*
function loadGame() {
    startButton.style.display = 'none';
    Love(Module);
}*/

window.onload = function () { window.focus(); };
window.onclick = function () { window.focus(); };
    
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
        e.preventDefault();
}, false);

function FullScreenHook(){
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

var onfullscreenchange = function() {
    if (document.fullscreenElement) {
        //canvas.style.visibility = 'visible';
        resumeButton.style.display = 'none';
        FullScreenHook();
    } else {
        //canvas.style.visibility = 'hidden';
        resumeButton.style.display = 'inline';
    }
};
window.onfullscreenchange = onfullscreenchange;
window.onresize = onfullscreenchange;

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
            loadingText.innerHTML = text;
        } else if (Module.remainingDependencies === 0) {
            loadingText.innerHTML = '';
            canvas.style.visibility = 'visible';
            onfullscreenchange();
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

//Module.setStatus('Downloading...');
window.onerror = function(e) {
    // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
    Module.setStatus('Exception thrown, see JavaScript console');
    Module.setStatus = function(text) {
        if (text)
            Module.printErr('[post-exception status] ' + text);
    };
};
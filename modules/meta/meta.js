export class Meta {
    constructor() {
        this.baseRatio = 1;

        /** Act on the size of each pixel */
        this.ratio = this.baseRatio;

        /** Frames per second */
        this.fps = 0;

        /** Setting to true dispays the fps on screen */
        this.displayFps = true;

        /** Game time multiplier */
        this.deltaTime = 1;

        /** Target frames per second */
        this.targetFrames = 60;

        /** Target frame time */
        this.perfectFrameTime = 1000 / this.targetFrames;
        this.lastTimestamp = Date.now();
        this.timestamp = Date.now();

        this.loopType = 0;

        this.baseTilesWidth = 25;
        this.baseTilesHeight = 19;
        /** Number of tiles displayed on screen (width) */
        this.tilesWidth = this.baseTilesWidth;
        /** Number of tiles displayed on screen (height) */
        this.tilesHeight = this.baseTilesHeight;
        this.init();
    }
    /** Sets the amount of tiles displayed on screen, depenging on the available space 
     * @param {Number} width Width of the canvas (in pixels)
     * @param {Number} height Height of the canvas (in pixels)
     */
    setScreenTiles = (width, height) => {
        this.baseTilesWidth = width / (this.tilesize * this.ratio);
        this.baseTilesHeight = height / (this.tilesize * this.ratio);
        this.tilesWidth = this.baseTilesWidth;
        this.tilesHeight = this.baseTilesHeight;
    }
    /** Initializes the fps counter if displayFps == true */
    init = () => {
        if (this.displayFps) {
            // Set fps timer
            let fpsSpan = document.createElement("span");

            fpsSpan.style.position = "absolute";
            fpsSpan.style.color = "white";
            fpsSpan.style.left = "5px";
            fpsSpan.style.top = "5px";
            document.body.appendChild(fpsSpan);
            setInterval(() => {
                this.fpsCounter(fpsSpan);
            }, 1000);
        }
    }
    /** Updates deltaTime and the fps counter */
    compute = () => {
        this.fps += 1;
        this.updateDeltaTime();
    }
    /** Calculates the difference (delta) of the time elapsed and supposed game speed  */
    updateDeltaTime = () => {
        this.lastTimestamp = this.timestamp;
        this.timestamp = Date.now();
        this.deltaTime =
            (this.timestamp - this.lastTimestamp) / this.perfectFrameTime;

        // Forces the max slowness as half the fps target
        if (this.deltaTime > 2) {
            this.deltaTime = 2;
        }
    }

    /** Keeps count of the fps, called in a setInterval. */
    fpsCounter = (span) => {
        span.innerHTML = this.fps+ " <small>fps</small>";
        this.fps = 0;
    }
}
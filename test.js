class TestClass {

    constructor(junctionList) {
        // this.junctionList = [] = junctionList
        this.intNo = 0
        this.startAnimating(1)
    }
    startAnimating(fps) {
        console.log(fps)
        this.fpsInterval = 1000 / fps;
        this.then = Date.now();
        this.startTime = this.then;
        this.animate();
    }
    animate = () => {
        //console.log('test')
        requestAnimationFrame(this.animate)
        this.now = Date.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);

            
        }
    }
}
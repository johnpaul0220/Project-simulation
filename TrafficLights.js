class TrafficLights {
    constructor(dataURL, FPS, junctioName, Map,junctionList) {
        this.junctionList = junctionList
        this.activeGreenLayer = ''
        this.dataURL = dataURL;
        this.FPS = FPS
        this.junctioName = junctioName
        this.FenceList = []
        this.Map = Map
        this.enableESDS = false
        this.intNo = 0
        this.test 
        this.addSource()
        this.addLayer()
        this.startAnimation()
        
    }

    addSource = () => {
        this.Map.addSource(this.junctioName, {
            "type": 'geojson',
            'data': this.dataURL
        })
    }

    addLayer() {
        fetch(this.dataURL)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.List = []
                console.log(data)
                data.features.forEach(element => {
                    this.List.push(element.properties.fence)
                })
                this.FenceList = this.List
                return data
            })
            .then(() => {
                this.FenceList.forEach(element => {
                    this.Map.addLayer({
                        'id': this.junctioName + element,
                        'type': 'fill',
                        'source': this.junctioName,
                        'paint': {
                            'fill-color': '#00ff4c', // blue color fill
                            'fill-opacity': 0.5
                        },
                        'filter': ['==', 'fence', element]
                    })
                });
            })
            .catch(err => console.log(err))

    }
    startAnimation = () => {
        //console.log(this.FenceList)
        //console.log(this.Map.getLayer('NorthFence'))
        this.fpsInterval = 1000 / (1/4);
        this.then = Date.now();
        this.startTime = this.then;
        this.animate()
    }
    getLayerDetails = () => {

    }

    animate = () => {
        requestAnimationFrame(this.animate)
        this.now = Date.now();
        this.elapsed = this.now - this.then;

        if(this.enableESDS){
            console.log(this.enableESDS)
            for (let index = 0; index < this.FenceList.length; index++) {
                 console.log('active :'+this.activeGreenLayer)
                if(this.activeGreenLayer == this.junctioName + this.FenceList[(index) % this.FenceList.length]){
                    this.Map.setPaintProperty(this.activeGreenLayer,'fill-color','#00ff4c')
                }     
                else{
                    this.Map.setPaintProperty(this.junctioName + this.FenceList[(index) % this.FenceList.length], 'fill-color','#ff003c')
                }          
            }
        }
        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            // console.log(this.junctioName + this.FenceList[(this.intNo) % this.FenceList.length])
            //console.log(this.enableESDS)
            if(!this.enableESDS){
                console.log(this.test)
                this.Map.setPaintProperty(this.junctioName + this.FenceList[(this.intNo) % this.FenceList.length], 'fill-color', '#00ff4c')
                for (let i = 1; i < this.FenceList.length; i++) {
                    this.Map.setPaintProperty(this.junctioName + this.FenceList[(this.intNo + i) % this.FenceList.length], 'fill-color', '#ff003c')
                }
                this.isGreen = this.intNo % this.FenceList.length;
                this.intNo++
            }

        }
    }
}
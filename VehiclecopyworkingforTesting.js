class Vehicle {
    constructor(map, dataURL, routeName, iconName, junctionList) {
        this.junctionList = [] = junctionList
        this.fpsInterval,
            this.fps
        this.startTime
        this.now
        this.then
        this.elapsed
        this.intNo = 0;
        this.dataURL = dataURL
        this.map = map
        this.iconName = iconName
        this.routeName = routeName
        this.fence = null
        this.junctionCleared = false
        this.junction 
        this.fetchRouteData()
        

    }
    linePoints = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': []
                }
            }
        ]
    };
    iconPoints = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': []
                }
            }
        ]
    };
    fetchRouteData() {
        fetch(this.dataURL)
            .then(response => response.json())
            .then(data => {
                if (data.features.length > 1) {
                    this.JsonGeoData = data
                    this.noOfPoints = data.features.length
                    this.typeOfData = 'points'
                    console.log(this.noOfPoints)
                    console.log(this.JsonGeoData)

                }
                else {
                    this.typeOfData = 'linestring'
                    console.log(data.features[0].geometry.coordinates.length)
                    this.JsonGeoData = data
                    this.noOfPoints = data.features[0].geometry.coordinates.length
                }
                this.addSource()
                this.addLayer()
                this.startAnimating(5)//10
            }).catch(err => {
                throw (err)
            })
    }
    addSource() {
        this.map.addSource(this.routeName, {
            'type': 'geojson',
            'data': this.iconPoints
        })
        this.map.addSource(this.routeName + 'Line', {
            'type': 'geojson',
            'data': this.linePoints
        })
    }

    addLayer() {
        //map.addImage('ambulance-svgrepo-com')
        this.map.addLayer({
            'id': this.routeName + 'icon',
            'type': 'symbol',
            'source': this.routeName,
            'layout': {
                'icon-image': 'ambulance-svgrepo-com',
                'icon-image': this.iconName,
                'icon-size': 0.06,
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
            }
        })

        this.map.addLayer({
            'id': this.routeName + 'lineLayer',
            'type': 'line',
            'source': this.routeName + 'Line',
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#ed6498',
                'line-width': 8,
                'line-opacity': 0.8
            }
        })
    }
    startAnimating(fps) {
        this.fpsInterval = 1000 / fps;
        console.log(this.fpsInterval)
        this.then = Date.now();
        this.startTime = this.then;
        this.animate();
    }
    gpsPoint = (index) => {
        if (this.typeOfData == 'points') {
            return this.JsonGeoData.features[index].geometry.coordinates
        }
        else {
            return this.JsonGeoData.features[0].geometry.coordinates[index]
        }
    }
    animate = () => {
        requestAnimationFrame(this.animate)
        this.now = Date.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > this.fpsInterval && this.intNo < this.noOfPoints) {
            if (this.intNo == this.noOfPoints) {
                return
            }
            this.then = this.now - (this.elapsed % this.fpsInterval);

            fetch(`https://api.mapbox.com/v4/johnpaul0220.dr3d4z33/tilequery/${this.gpsPoint(this.intNo)}.json?access_token=pk.eyJ1Ijoiam9obnBhdWwwMjIwIiwiYSI6ImNrcWZxOW5mMjB0dDEycXBndjVxb2xiamwifQ.zxeqPGE4aSmVgLiJva_pdg`)
                .then(response => response.json())
                .then(data => {
                    if (data.features.length > 0) {
                        // console.log(data)
                        this.junction = this.junctionList.filter(entry => {
                            if (entry.junctioName == data.features[0].properties.junction) {
                                return entry
                            }
                        })
                        //
                        console.log(this.junction)
                        //[0].enableESDS
                        this.junction[0].enableESDS = true
                        this.junction[0].activeGreenLayer = `${data.features[0].properties.junction}${data.features[0].properties.fence}`
                        console.log(this.junction[0].activeGreenLayer)
                        
                     
                        //     if (this.fence == `${data.features[0].properties.junciton}${data.features[0].properties.fence}`) {
                        //         // note : do nothing youre in the same fence
                        //         console.log('same fence')
                        //         if(`${data.features[0].properties.junciton}${data.features[0].properties.fence}` == `${this.junction[0].junctioName}${this.junction[0].FenceList[this.junction[0].isGreen]}`){
                        //             //console.log('entered fence is green')
                        //             this.pause = false
                        //         }
                        //         else{
                        //             this.pause = true
                        //             //console.log('is red')
                        //         }
                        //     }
                        //     else if(this.fence == null ){
                        //         console.log('entered new Fence')
                        //         console.log('SEND START SEQ')
                        //         if(`${data.features[0].properties.junciton}${data.features[0].properties.fence}` == `${this.junction[0].junctioName}${this.junction[0].FenceList[this.junction[0].isGreen]}`){
                        //             //console.log('entered fence is green')
                        //             this.pause = false
                        //         }
                        //         else{
                        //             this.pause = true
                        //             //console.log('is red')
                        //         }    
                        //         this.fence = `${data.features[0].properties.junciton}${data.features[0].properties.fence}`
                        //         this.junctionCleared = false
                        //     }
                        //     else if(this.fence != `${data.features[0].properties.junciton}${data.features[0].properties.fence}`&& this.fence != null){
                        //         console.log('fence chaged')
                        //         console.log('SEND END SEQ')
                        //         this.fence =`${data.features[0].properties.junciton}${data.features[0].properties.fence}`
                        //         this.junctionCleared = true
                        //         //this.fence=null
                        //         //this.fence=null
                        //     }

                        //     // console.log(this.junction)
                        //     // console.log(`${data.features[0].properties.junciton}${data.features[0].properties.fence} == ${this.junction[0].junctioName}${this.junction[0].FenceList[this.junction[0].isGreen]}`)
                        //     // if(`${data.features[0].properties.junciton}${data.features[0].properties.fence}` == `${this.junction[0].junctioName}${this.junction[0].FenceList[this.junction[0].isGreen]}`){
                        //     //     //console.log('entered fence is green')
                        //     //     this.pause = false
                        //     // }
                        //     // else{
                        //     //     this.pause = true
                        //     //     //console.log('is red')
                        //     // }

                        // }
                        // else if(this.junctionCleared){
                        //     this.fence=null
                        //     this.junctionCleared=false
                        // }
                    }
                    else{
                        this.junction[0].enableESDS = false
                    }
                })
            if (this.intNo <= this.noOfPoints && !this.pause) {

                //this.linePoints.features[0].geometry.coordinates.push(this.JsonGeoData.features[0].geometry.coordinates[this.intNo]);
                // map.getSource(this.routeName + 'Line').setData(this.linePoints);
                map.getSource(this.routeName).setData({
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": this.gpsPoint(this.intNo)
                    }
                });
                map.panTo(this.gpsPoint(this.intNo))
                //console.log('psd')
                this.intNo++
            }
        }
    }
}
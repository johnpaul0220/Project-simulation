class Vehicle {
    constructor(map, dataURL, routeName, iconName, junctionList, autoZoom, enableESDS) {
        this.enableESDS = enableESDS
        this.autoZoom = autoZoom
        this.junctionList = [] = junctionList
        console.log(junctionList)
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
        this.fetchRouteData()
        this.junctionCleared = false

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
    getLayerNameFromTileSet=(data)=>{
        return data.features[0].properties.junction+data.features[0].properties.fence
    }
    getJunctionFromTileSet=(data)=>{
        return data.features[0].properties.junction
    }
    getGreenLayer=()=>{
        return  `${this.junction[0].junctioName}${this.junction[0].FenceList[this.junction[0].isGreen]}`
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
            // console.log(this.gpsPoint(this.intNo))
            //johnpaul0220.2gdjokli
            //johnpaul0220.66voaakr
            //johnpaul0220.5kgqr3xc
            // johnpaul0220.dr3d4z33
            // console.log(this.gpsPoint(this.intNo))
            fetch(`https://api.mapbox.com/v4/johnpaul0220.dr3d4z33/tilequery/${this.gpsPoint(this.intNo)}.json?access_token= `)
                .then(response => response.json())
                .then(data => {

                    if (data.features.length != 0) {
                        // console.log(data)
                        //features[0].properties.junction
                        //[3].junctioName
                        this.junction = this.junctionList.filter(entry => {
                            //console.log(data.features[0].properties.junction)
                            if (entry.junctioName == this.getJunctionFromTileSet(data)) {
                                return entry
                            }
                        })
                        //console.log(this.junction)
                        if (this.enableESDS) {
                            this.junctionList.forEach(element => {
                                let layer = this.getLayerNameFromTileSet(data)
                                // console.log('layer ' +layer)
                                if (element.junctioName == this.getJunctionFromTileSet(data)) {
                                    // console.log(element.junctioName+ '='+data.features[0].properties.junction)
                                    element.enableESDS = true
                                    element.activeGreenLayer = layer
                                    //console.log(this.map.getLayer('BogmaloDabolimJunctionSouthWestFence'))
                                    //this.map.setPaintProperty(layer, 'fill-color','#00ff4c')//features[0].properties.fence
                                }
                                else{
                                    element.enableESDS = false

                                }

                            });
                            //console.log(this.junction.enableESDS)
                            //this.junctioName + this.FenceList[(this.intNo) % this.FenceList.length]
                            //console.log(`${data.features[0].properties.junction}${data.features[0].properties.fence}`)
                        }


                        if (this.fence == this.getLayerNameFromTileSet(data)) {
                            // note : do nothing youre in the same fence
                            console.log('same fence')
                            if (this.junctionCleared) {
                                if(!this.enableESDS)
                                    this.pause = false
                            }
                            else if (this.getLayerNameFromTileSet(data) == this.getGreenLayer()) {
                                console.log('entered fence is green')
                                if(!this.enableESDS)
                                    this.pause = false
                            }
                            else {
                                if(!this.enableESDS)
                                    this.pause = true
                                console.log('is red')
                            }

                        }
                        if (this.fence == null) {
                            console.log('entered new Fence')
                            console.log('SEND START SEQ')
                            if (this.getLayerNameFromTileSet(data) == this.getGreenLayer()) {
                                
                                if(!this.enableESDS)
                                    this.pause =false
                            }
                            else {
                                if(!this.enableESDS)
                                    this.pause = true
                            }
                            this.fence = this.getLayerNameFromTileSet(data)
                            this.junctionCleared = false
                        }
                        else if (this.fence != this.getLayerNameFromTileSet(data)&& this.fence != null) {
                            console.log('fence chaged')
                            console.log('SEND END SEQ')
                            this.junctionList.forEach(element => {
                                if (element.junctioName == this.getJunctionFromTileSet(data)) {
                                    // console.log(element.junctioName+ '='+data.features[0].properties.junction)
                                    console.log('enable false')
                                    element.enableESDS = false
                                    console.log(element.enableESDS + element.junctioName)
                                }
                            });
                            this.fence = this.getLayerNameFromTileSet(data)
                            this.junctionCleared = true
                            if(!this.enableESDS)
                                this.pause = false
                        }
                    }
                    else if (this.junctionCleared) {
                        this.fence = null
                        this.junctionCleared = false
                    }
                }).catch(err=>console.error(err))
            if (this.intNo <= this.noOfPoints && !this.pause) {

                this.linePoints.features[0].geometry.coordinates.push(this.gpsPoint(this.intNo));
                // map.getSource(this.routeName + 'Line').setData(this.linePoints);
                //[0].geometry.coordinates
                map.getSource(this.routeName).setData({
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": this.gpsPoint(this.intNo)
                    }
                });
                if (this.autoZoom) {
                    map.panTo(this.gpsPoint(this.intNo))
                }
                this.intNo++
            }
        }
    }
}
//Initialise the 'map' object

var map; //complex object of type OpenLayers.Map
var options = {
	controls:[
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
        new OpenLayers.Control.Attribution()],
	projection: new OpenLayers.Projection("EPSG:900913"),
	displayProjection: new OpenLayers.Projection("EPSG:4326"),
	allOverlays: true,
	numZoomLevels: 18,
	units: "m",
	maxResolution: 156543.0399,
	//maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
	maxExtent: new OpenLayers.Bounds(41.376418, 2.171061, 41.373467, 2.166619)	
};



OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },

    initialize: function(options) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        ); 
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.trigger
            }, this.handlerOptions
        );
    }, 

    trigger: function(e) {
		var lonlat = map.getLonLatFromViewPortPx(e.xy);
		lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		$.post("foo",{
			"lat":lonlat.lat,
			"lon":lonlat.lon
			}
		);
		//$.get("report2");
		$("#values").html("<input type=\"hidden\" value="+ lonlat.lat +" name=\"lat\"/>\n<input type=\"hidden\" value="+ lonlat.lon +" name=\"lon\"/>");
		$("#side").load("report_a_problem");


    }

});



function init(){
	
	map = new OpenLayers.Map('map', options);
	var layers = [];
		
	// create OSM layer
    var osm = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
	map.addControl( new OpenLayers.Control.LayerSwitcher());
	map.addControl( new OpenLayers.Control.MousePosition());
/*
    layers.push(osm);
	//and finally, show the layers on a #map
	map.addLayers(layers);	
	//set the center
	var proj = new OpenLayers.Projection("EPSG:4326");
	var point = new OpenLayers.LonLat(lon, lat);
	map.setCenter(point.transform(proj, map.getProjectionObject()), 17);
	

*/
}

function setMap(lat, lon){
	map = new OpenLayers.Map('map', options);
	var layers = [];
	layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
	map.addLayer(layerMapnik);
	layerTilesAtHome = new OpenLayers.Layer.OSM.Osmarender("Osmarender");
	map.addLayer(layerTilesAtHome);
	layerMarkers = new OpenLayers.Layer.Markers("Markers");
	map.addLayer(layerMarkers);
	//map.addControl( new OpenLayers.Control.LayerSwitcher());
	map.addControl( new OpenLayers.Control.MousePosition());
	this.proj = new OpenLayers.Projection("EPSG:4326");
	this.point = new OpenLayers.LonLat(lon, lat);
	map.setCenter(this.point.transform(this.proj, map.getProjectionObject()), 17);
	//activamos el click
	var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
	

}


function getUserPosition(position){
	this.proj = new OpenLayers.Projection("EPSG:4326");
	this.point = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude);
	map.setCenter(this.point.transform(this.proj, map.getProjectionObject()), 18);
    //alert(position.coords.accuracy);
  	//TODO: draw a circle to show the center and accuracy of geolocation
}




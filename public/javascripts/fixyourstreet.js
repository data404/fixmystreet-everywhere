var map;
var lat=41.37487;
var lat2=41.375634833838;
var lon2=2.168393;
var lon=2.16834;
var zoom=17;

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
	defaultHandlerOptions: {
	'single': true,
	'double': false,
	'pixelTolerance': 0,
	'stopSingle': false,
	'stopDouble': false
	},
	initialize: function(options) {
		this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
		OpenLayers.Control.prototype.initialize.apply(this, arguments); 
		this.handler = new OpenLayers.Handler.Click(this, { 'click': this.trigger }, 
			this.handlerOptions
		);
	}, 
	trigger: function(e) {
		var lonlat = map.getLonLatFromViewPortPx(e.xy);
		lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		alert("You clicked near " + lonlat.lat + " N, " + lonlat.lon + " E");
	}
});


function init(){
		map = new OpenLayers.Map({
			div: "map",
			maxResolution: 156543.0399,
			numZoomLevels: 1,
			units: 'm',
			projection: new OpenLayers.Projection("EPSG:900913"),
			displayProjection: new OpenLayers.Projection("EPSG:4326")
		});
		map.addLayer(new OpenLayers.Layer.OSM.Mapnik("Mapnik"));
		map.addControl(new OpenLayers.Control.LayerSwitcher());

		if( ! map.getCenter() ){
			var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
			map.setCenter (lonLat, zoom);
		}
		layerMarkers00 = new OpenLayers.Layer.Markers("Abandoned vehicles");
		layerMarkers01 = new OpenLayers.Layer.Markers("Benches / bicycle racks");
		layerMarkers02 = new OpenLayers.Layer.Markers("Bus stops");
		layerMarkers03 = new OpenLayers.Layer.Markers("Car parking");
		layerMarkers04 = new OpenLayers.Layer.Markers("Dog fouling");
		layerMarkers05 = new OpenLayers.Layer.Markers("Flyposting");
		layerMarkers06 = new OpenLayers.Layer.Markers("Flytipping");
		layerMarkers07 = new OpenLayers.Layer.Markers("Graffiti");
		layerMarkers08 = new OpenLayers.Layer.Markers("Parks/landscapes");
																		
		map.addLayers([layerMarkers00, layerMarkers01, layerMarkers02, layerMarkers03, layerMarkers04]);
	

		var size = new OpenLayers.Size(32,32);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon('/img/lightning_sign_32.png',size,offset);
		var icon_barrel = new OpenLayers.Icon('/img/Barrel-32x32.png',size,offset);
		layerMarkers00.addMarker(new OpenLayers.Marker(lonLat,icon));
		var point = new OpenLayers.LonLat(lon2, lat2).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())
		var marker = new OpenLayers.Marker(point ,icon_barrel);
		layerMarkers01.addMarker(marker);
		popup  = new OpenLayers.Popup.Anchored("chicken",
			point,
			new OpenLayers.Size(200,100),
			"<p>Welcome to Barcelona</p>");
		popup.hide();
		map.addPopup(popup);
		
		marker.events.register( "click", marker,
		        function (e) { popup.toggle() }
		);
		//var click = new OpenLayers.Control.Click();
		//map.addControl(click);
		//click.activate();

}
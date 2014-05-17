'use strict';

WAR.module.Map = {
	init: function () {
		console.log('init map');
		google.maps.event.addDomListener(window, 'load', this.attach.bind(this));	
	},

	attach: function (settings) {
		this.settings = {
			zoom: 4,
			minZoom: 4,
			maxZoom: 6,
			disableDefaultUI: true,
			center: new google.maps.LatLng(-14.0634424, -50.2827613)
		};

		this.setup();
		this.events();		
	},

	setup: function () {
		this.map = new google.maps.Map(document.getElementById('game'), this.settings);
		this.geocoder = new google.maps.Geocoder();
		this.markers = [];

		this.mapBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(-28.1354884,-68.1965992),
			new google.maps.LatLng(-1.4372482,-40.0657399)
		);

		new google.maps.KmlLayer({
			url: 'https://sites.google.com/a/gmapas.com/home/poligonos-ibge/poligonos-estados-do-brasil/Estados.kmz'
		}).setMap(this.map);
	},

	events: function () {
		var _this = this,
			lastValidCenter = this.map.getCenter();

		google.maps.event.addListener(this.map, 'center_changed', function() {
			if (_this.mapBounds.contains(_this.map.getCenter())) {
				lastValidCenter = _this.map.getCenter();
				return;
			}

			_this.map.panTo(lastValidCenter);
		});

	},

	addMarker: function (lat, lng, pinColor) {
		var pinImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + pinColor,
			new google.maps.Size(21, 34),
			new google.maps.Point(0,0),
			new google.maps.Point(10, 34));

		return new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: this.map,
			icon: pinImage,
      clickable: false
		});
	},

	getCountry: function (ev, callback) {
		this.geocoder.geocode({
			'latLng': ev.latLng
		}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				var geocoderAddressComponent, addressComponentTypes, address;

				for (var i in results) {
					geocoderAddressComponent = results[i].address_components;

					for (var j in geocoderAddressComponent) {
						address = geocoderAddressComponent[j];
						addressComponentTypes = geocoderAddressComponent[j].types;

						for (var k in addressComponentTypes) {
							if (addressComponentTypes[k] == 'administrative_area_level_1') {
								if (address.short_name === 'DF') {
									address = {
										long_name: 'Goiás',
										short_name: 'GO'
									};
								}

								return callback(address);
							}
						}
					}
				}

				callback('Unknown');
			}
		});
	}

};

var map;
var myApp = {};
// Create a new blank array for all the listing markers.
var markers = [];
// This global polygon variable is to ensure only ONE polygon is rendered.
var polygon = null;
var locationId = [];

//creation of viewModel
var viewModel = {
    selectedValue: ko.observable(),
    selectedText: ko.observable(),
    searchText: ko.observable()


};

// These are the locations to visit in Austin that will be shown to the user.
var locations = [{
        title: 'Zilker Botanical Garden',
        location: {
            lat: 30.269501,
            lng: -97.772644
        },
        flag: false
    },
    {
        title: 'Austin Nature & Science Center',
        location: {
            lat: 30.2721499,
            lng: -97.7748158
        },
        flag: false
    },
    {
        title: 'Texas Capitol, Austin',
        location: {
            lat: 30.2746652,
            lng: -97.740350
        },
        flag: false
    },
    {
        title: 'Mayfield Park and Nature Preserve',
        location: {
            lat: 30.3129736,
            lng: -97.77162000000001
        },
        flag: false
    },
    {
        title: 'Graffiti Park at Castle Hill',
        location: {
            lat: 30.276165,
            lng: -97.753309
        },
        flag: false
    },
    {
        title: 'Lady Bird Johnson Wildflower ',
        location: {
            lat: 30.1854455,
            lng: -97.8732112
        },
        flag: false
    }
];



// This function allows the user to input a desired  travel mode, and a location,
//get all the info for the distances between the entered location and the listings.

viewModel.distanceInfo = function() {

    // Initialize the distance matrix service.
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    var address = document.getElementById('search-text').value;
    // Check to make sure the place entered isn't blank.
    if (address == '') {
        window.alert('You must enter an address.');
    } else {
        hideMarkers(markers);
        // Use the distance matrix service to calculate the duration of the
        // routes between all our markers, and the destination address entered
        // by the user. Then put all the origins into an origin matrix.
        var origins = [];
        for (var i = 0; i < markers.length; i++) {
            origins[i] = markers[i].position;
        }
        var destination = address;
        var mode = viewModel.selectedValue();
        // Now that both the origins and destination are defined, get all the
        // info for the distances between them.
        distanceMatrixService.getDistanceMatrix({
            origins: origins,
            destinations: [destination],
            travelMode: google.maps.TravelMode[mode],
            unitSystem: google.maps.UnitSystem.IMPERIAL,
        }, function(response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                window.alert('Error was: ' + status);
            } else {
                displayDuration(response);
            }
        });
    }

};




function initMap() {
    // Create a styles array to use with the map.

    var styles = [{
        featureType: 'water',
        stylers: [{
            color: '#19a0d8'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{
                color: '#ffffff'
            },
            {
                weight: 6
            }
        ]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -40
            }
        ]
    }, {
        featureType: 'transit.station',
        stylers: [{
                weight: 9
            },
            {
                hue: '#e85113'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{
            visibility: 'off'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: -100
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
                visibility: 'on'
            },
            {
                color: '#f0e4d3'
            }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
                color: '#efe9e4'
            },
            {
                lightness: -25
            }
        ]
    }];
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        //center: {lat: 40.7413549, lng: -73.9980244},
        center: {
            lat: 30.267153,
            lng: -97.74306
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });
    // This autocomplete is for use in the search within time entry box.
    var timeAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-text'));


    var listView = document.getElementById('list-view');
    var options = document.getElementById('options');

    // this loop sets the location list options and list-view on the map.
    for (var i = 0; i < locations.length; i++) {
        locationId[i] = (locations[i].title).replace(/\s+/g, '');
        listView.innerHTML += '<div id =' + locationId[i] + '>' + locations[i].title + '<div><hr class ="hr">';
        options.innerHTML += '<option >' + locations[i].title + '</option>';

    }


    makeMarkers(locations, locationId);




    // Initialize the drawing manager.
    myApp.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        }
    });


}


//This function updates the locations-list on the map,
//based on the input of the location entered/selected by the user. 
viewModel.filter = function() {
    var isInputPresent = false;
    var element = document.getElementById('list-view');
    //initially flag value of each location is set to false.
    for (var i = 0; i < locations.length; i++) {
        locations[i].flag = false;
    }
    var tempId = [];
    var value = document.getElementById('destination-input').value;
    if (value == '') {
        window.alert("please enter something");
    } else {
        //initially the location list is made empty

        element.innerHTML = '';

        var j = 0;
        //for every current location, search if the input location value is a substring,
        //if then, update the location-list on map with the current locations.
        for (var i = 0; i < locations.length; i++) {
            var current = (locations[i].title).toLowerCase();
            if (current.indexOf((value).toLowerCase()) >= 0) {
                tempId[j] = locationId[i];
                element.innerHTML += '<div id =' + locationId[i] + '>' + locations[i].title + '<div><hr class ="hr">';
                isInputPresent = true;
                j++;

            } else {
                locations[i].flag = true;
            }
        }


    }
    //if the entered or selected location value is not present,
    //then location-list on map is empty, else present markers on the map 
    //using makeMarkers().
    if (!isInputPresent) {

        element.innerHTML += '<p>' + "No such place is present, please enter some other location name" + '</p>';
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }

    } else
        makeMarkers(locations, tempId);
}




//This function enables the feature of drawing tool on the google map
//drawing tool helps to show markers within the polygon drawn
viewModel.drawing = function() {
    //toggles the drawing options.
    toggleDrawing(myApp.drawingManager);
    // Adding the event listener so that the polygon is captured,  call the
    // searchWithinPolygon function. 
    myApp.drawingManager.addListener('overlaycomplete', function(event) {
        // Check if there is an existing polygon.
        // If there is, remove the markers.
        if (polygon) {
            polygon.setMap(null);
            hideMarkers(markers);
        }
        // Switching the drawing mode to the HAND.
        myApp.drawingManager.setDrawingMode(null);
        // Creating a new editable polygon from the overlay.
        polygon = event.overlay;
        polygon.setEditable(true);
        // Searching within the polygon.
        searchWithinPolygon(polygon);
        // Make sure the search is re-done if the poly is changed.
        polygon.getPath().addListener('set_at', searchWithinPolygon);
        polygon.getPath().addListener('insert_at', searchWithinPolygon);
    });


};



viewModel.reload = function() {
    location.reload();
}




// This function hides all markers outside the polygon,
// and shows only the ones within it. This is so that the
// user can specify an exact area of search.
function searchWithinPolygon() {
    for (var i = 0; i < markers.length; i++) {
        if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
            markers[i].setMap(map);
        } else {
            markers[i].setMap(null);
        }
    }
}


// This shows and hides (respectively) the drawing options.
function toggleDrawing(drawingManager) {
    if (drawingManager.map) {
        drawingManager.setMap(null);
        // In case the user drew anything, get rid of the polygon
        if (polygon !== null) {
            polygon.setMap(null);
        }
    } else {
        drawingManager.setMap(map);
    }
}




//This function makes markers on the map,
//when ever this function is called the map gets updated with the given locations argument
function makeMarkers(locations, locationId) {
    //initially map doesn't diplay any markers.
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    var length = markers.length;
    //pop the markers from array of markers.
    for (var i = 0; i < length; i++) {
        var tem = markers.pop();
    }

    var largeInfowindow = new google.maps.InfoWindow();
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {

        if (!(locations[i].flag)) {
            // Get the position from the location array.
            var position = locations[i].location;
            var title = locations[i].title;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: defaultIcon,
                id: i
            });
            // Push the marker to our array of markers.
            markers.push(marker);

            // Create an onclick event to open the large infowindow at each marker.
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfowindow);
            });
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });

        }

    }


    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);


    var td;
    //populating the infowindow when the marker is clicked using JavaScript closures
    for (var t = 0; t < markers.length; t++) {
        td = document.getElementById(locationId[t]);
        (function(_t) {
            td.addEventListener('click', function() {
                populateInfoWindow(markers[_t], largeInfowindow);
            });
        })(t);

    }
}




// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.


function populateInfoWindow(marker, infowindow) {
    var contentString;
    
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

        //url for flickr  call.
        var flickrCall = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=18a82ec4112b6cb9f42d915829e86d6f&text= ' + marker.title + '&format=json&jsoncallback=?';

        var item;
        //Connects to the Flickr API and reads the results of the query into a JSON array. 
        $.getJSON(flickrCall, function(data) {

                item = data.photos.photo[0];

                //Read in the title of each photo
                var photoTitle = item.title;

                //Get the url for the image.
                var photoURL = 'https://farm' +
                    item.farm + '.static.flickr.com/' +
                    item.server + '/' +
                    item.id + '_' +
                    item.secret + '_m.jpg';

                var image = '<img src="' + photoURL + '" alt="' + photoTitle + '" />';
                var imageLink = '<a href="https://www.flickr.com/photos/' + item.owner + '/' + item.id + '/" target="_blank">View on Flickr</a>'
                contentString = '<div >' + '<br>' + image + '<br>' + imageLink + '</div>';

                // Open the infowindow on the correct marker.*/
                infowindow.setContent('<div>' + marker.title + '</div>' + contentString);
                //infowindow.setContent(contentString);
                infowindow.open(map, marker);
            }
        ).error(function() {
            infowindow.setContent('<p>' + "Flickr can not be loaded" + '</p>');
            infowindow.open(map, marker);
        });




    }
}


// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}



// This function will go through each of the results, 
// and, show it on the map.
function displayDuration(response) {

    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    // Parse through the results, and get the distance and duration of each.
    // Because there might be  multiple origins and destinations we have a nested loop
    // Then, make sure at least 1 result was found.

    for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
            var element = results[j];
            if (element.status === "OK") {
                // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
                // the function to show markers within a user-entered DISTANCE, we would need the
                // value for distance, but for now we only need the text.
                var distanceText = element.distance.text;
                // Duration value is given in seconds so we make it MINUTES. We need both the value
                // and the text.
                var duration = element.duration.value / 60;
                var durationText = element.duration.text;

                markers[i].setMap(map);

                // Create a mini infowindow to open immediately and contain the
                // distance and duration
                var infowindow = new google.maps.InfoWindow({
                    content: durationText + ' away, ' + distanceText +
                        '<div><input type=\"button\" value=\"View Route\" onclick =' +
                        '\"displayDirections(&quot;' + origins[i] + '&quot;);\"></input></div>'
                });
                infowindow.open(map, markers[i]);
                // Put this in so that this small window closes if the user clicks
                // the marker, when the big infowindow opens
                markers[i].infowindow = infowindow;
                google.maps.event.addListener(markers[i], 'click', function() {
                    this.infowindow.close();
                });

            }
        }
    }

}

// This function is in response to the user selecting "show route" on one
// of the markers within the calculated distance. This will display the route
// on the map.
function displayDirections(origin) {
    hideMarkers(markers);
    var directionsService = new google.maps.DirectionsService;
    // Get the destination address from the user entered value.
    var destinationAddress =
        document.getElementById('search-text').value;
    // Get mode again from the user entered value.
    var mode = document.getElementById('mode').value;
    directionsService.route({
        // The origin is the passed in marker's position.
        origin: origin,
        // The destination is user entered address.
        destination: destinationAddress,
        travelMode: google.maps.TravelMode[mode]
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                draggable: true,
                polylineOptions: {
                    strokeColor: 'green'
                }
            });
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

mapError = () => {
  window.alert("map failed to load");
};
ko.applyBindings(viewModel);
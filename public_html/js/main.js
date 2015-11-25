var map;
var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=Helsinki&format=json&callback=wikiCallback';
var app = app || {};




var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
        '<div id="bodyContent">' +
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the ' +
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
        'south west of the nearest large town, Alice Springs; 450&#160;km ' +
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
        'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
        'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
        'Aboriginal people of the area. It has many springs, waterholes, ' +
        'rock caves and ancient paintings. Uluru is listed as a World ' +
        'Heritage Site.</p>' +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
        '(last visited June 22, 2009).</p>' +
        '</div>' +
        '</div>';

var infowindow = new google.maps.InfoWindow({
    content: contentString
});




initMap = function () {

    var myLatLng = {lat: 60.168876, lng: 24.942923};
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: myLatLng,
        zoom: 14
    });

    /*
     * Sample code from:
     * https://developers.google.com/maps/documentation/javascript/examples/event-simple
     */
    /*
     map.addListener('center_changed', function () {
     // 3 seconds after the center of the map has changed, pan back to the
     // marker.
     window.setTimeout(function () {
     map.panTo(viewModel.selectedPlace().marker.getPosition());
     }, 3000);
     });
     */

}();
createMarker = function (place) {

    var marker = new google.maps.Marker({
        map: map,
        name: place.placeTitle,
        position: place.placeLatLng,
        place_id: place.placeId,
        animation: google.maps.Animation.DROP,
        label: place.placeId.toString(),
        _place: place

    });
    marker.setMap(map);
    console.log(place.placeTitle)


    /*
     * 
     */
    marker.addListener('click',
            (function (test) { // lets create a function who has a single argument "test"
                // inside this function test will refer to the functions argument
                return function (data) {
                    // test still refers to the closure functions argument
                    viewModel.selectPlace(test, false);
                };
            })(place) // immediately call the closure with the current value of test
            );





    return marker;
};



app.viewModel = function () {
//Data

    //var myLatLng = {lat: 60.168876, lng: 24.942923};
    var self = this;
    self.searchTerm = ko.observable('');
    self.places = ko.observableArray([
        {
            placeId: 1,
            placeTitle: "Esplanade Park",
            placeLatLng: {lat: 60.167512017577174, lng: 24.947505111145006}
        },
        {
            placeId: 2,
            placeTitle: "Kaisaniemi Park",
            placeLatLng: {lat: 60.17485290609435, lng: 24.945841243408267} // 60.17485290609435 24.945841243408267
        },
        {
            placeId: 3,
            placeTitle: "Kaivopuisto Park",
            placeLatLng: {lat: 60.155915187055626, lng: 24.95605509533698} // 60.155915187055626 24.95605509533698
        },
        {
            placeId: 4,
            placeTitle: "Kansalaistori Park",
            placeLatLng: {lat: 60.174639463887075, lng: 24.933996608398502} // 60.174639463887075 24.933996608398502
        },
        {
            placeId: 5,
            placeTitle: "Tahtitornin Vuori Park ",
            placeLatLng: {lat: 60.16216968536506, lng: 24.95291244451903} // 60.16216968536506 24.95291244451903
        }

    ]);

    self.placesToShow = ko.pureComputed(function () {
        var desiredName = this.searchTerm();
        return ko.utils.arrayFilter(this.places(), function (place) {
            var show = true;
            if (desiredName !== '')
            {
                show = new RegExp(desiredName, 'i').test(place.placeTitle);
            }
            place.marker.setMap(show ? map : null);

            return show;
        });
    }, this);

    self.selectedPlace = ko.observable();
    // Behaviours

    self.selectPlace = function (place, panToMarker) {
        self.selectedPlace(place);
        //bounce selected marker
        for (var i = 0; i < viewModel.places().length; i++)
        {
            viewModel.places()[i].marker.setAnimation(google.maps.Animation.NONE);
        }
        place.marker.setAnimation(google.maps.Animation.BOUNCE);

        infowindow.open(map, place.marker);

        // TODO: some ajax..

        if (panToMarker)
            map.panTo(place.marker.getPosition());

    };
};
var viewModel = new app.viewModel();
for (var i = 0; i < viewModel.places().length; i++)
{
    console.log(i);
    viewModel.places()[i].marker = createMarker(viewModel.places()[i]);
}

ko.applyBindings(viewModel);
        
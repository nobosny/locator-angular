(function() {
    angular
        .module('starterApp', ['ngMaterial', 'ngMap', 'ngAnimate', 'ngFx'])
        .config(ConfigFunc)
        .controller('SearchCtrl', SearchCtrl);

    function ConfigFunc($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('light-blue');
    }

    function SearchCtrl($scope, $mdToast, $animate, $location, $anchorScroll, $filter) {
        var searchObj = this;
        var myMap;

        $scope.$on('mapInitialized', function(evt, evtMap) {
            myMap = evtMap;
        });

        searchObj.callid = '';
        searchObj.location = '';
        searchObj.locationResolved = null;
        searchObj.locCenter = null;
        searchObj.taxNames = [];
        searchObj.distanceEnabled = true;
        searchObj.needsEnabled = false;
        searchObj.providersEnabled = false;
        searchObj.miles = 5;
        searchObj.needs = 1;
        searchObj.providers = 5;

        searchObj.searching = false;
        searchObj.searchResults = [];

        searchObj.drawerOpen = true;

        searchObj.searchDo = function() {

            if (searchObj.taxNames.length > 0) {
                searchObj.searchResults = [];

                //searchObj.searching = true;

                $location.hash('search');
                $anchorScroll();

                searchObj.searchResults.push({title: 'Result 1', content: 'Loc: ' + searchObj.locationResolved.formatted_address});
                searchObj.searchResults.push({title: 'Result 2', content: 'Result Content 2'});
                searchObj.searchResults.push({title: 'Result 3', content: 'Result Content 3'});
                searchObj.searchResults.push({title: 'Result 4', content: 'Result Content 4'});
                searchObj.searchResults.push({title: 'Result 5', content: 'Result Content 5'});

                //searchObj.searching = false;

            } else {
                $mdToast.show(
                    $mdToast.simple()
                        .content('You must enter at least one taxonomy term. (Ex. Term1)')
                        .position('bottom left')
                        .hideDelay(3000)
                );
            }
        };

        searchObj.placeChanged = function() {
            searchObj.locationResolved = this.getPlace();

            //set center using this locationResolved
            myMap.setCenter(searchObj.locationResolved.geometry.location);
            myMap.setZoom(14);
            if (searchObj.locCenter != null) {
                searchObj.locCenter.setMap(null);
            }
            searchObj.locCenter = new google.maps.Marker({
                position: searchObj.locationResolved.geometry.location,
                map: myMap,
                animation: google.maps.Animation.DROP,
                title: 'User location'
            });

            var infowindow = new google.maps.InfoWindow({
                content: '<h3>User Location</h3>' +
                    '<p><strong>Address:</strong> ' + searchObj.locationResolved.formatted_address + '</p>' +
                    '<p>Latitude: ' + $filter('number')(searchObj.locationResolved.geometry.location.A, 6) +
                    '<br>Longitude: ' + $filter('number')(searchObj.locationResolved.geometry.location.F, 6) + '</p>'
            });

            searchObj.locCenter.addListener('click', function() {
                infowindow.open(myMap, searchObj.locCenter);
            });

            //alert(JSON.stringify(searchObj.locCenter));
        };

        searchObj.toggleSidenav = function() {
            searchObj.drawerOpen = !searchObj.drawerOpen;
            google.maps.event.trigger(myMap, 'resize');
        };
    }

})();



  
  
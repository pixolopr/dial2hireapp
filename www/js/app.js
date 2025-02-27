// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'myservices', 'uiGmapgoogle-maps', 'ngCordova']) /*,'google.places'*/

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $stateProvider

            .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'templates/search.html',
                    controller: 'searchCtrl'
                }
            }
        })

        .state('app.account', {
                url: '/account',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/account.html',
                        controller: 'accountCtrl'
                    }
                }
            })
            .state('app.share', {
                url: '/share',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/share.html',
                        controller: 'shareCtrl'
                    }
                }
            })
            .state('app.signup', {
                url: '/signup',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/signup.html',
                        controller: 'signupCtrl'
                    }
                }
            })
            .state('app.otp', {
                url: '/otp',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/otp.html',
                        controller: 'otpCtrl'
                    }
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'loginCtrl'
                    }
                }
            })
            .state('app.vehiclelist', {
                url: '/vehiclelist/:type/:location',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/vehiclelist.html',
                        controller: 'vehiclelistCtrl'
                    }
                }
            })
            .state('app.inquiries', {
                url: '/inquiries',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/inquiry.html',
                        controller: 'inquiriesCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/search');

        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.views.maxCache(0);
    })
    /*.directive('googleplace', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, model) {
                var options = {
                    types: [],
                    componentRestrictions: {
                        country: 'in'
                    }
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    scope.$apply(function () {
                        model.$setViewValue(element.val());
                    });
                });
            }
        };
    })*/
    .directive('reverseGeocode', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            link: function (scope, element, attrs) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
                geocoder.geocode({
                    'latLng': latlng
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            element.text(results[1].formatted_address);
                        } else {
                            element.text('Location not found');
                        }
                    } else {
                        element.text('Geocoder failed due to: ' + status);
                    }
                });
            },
            replace: true
        }
    })



.directive('clickForOptions', ['$ionicGesture', function ($ionicGesture) {
        return {
            restrict: 'A',



            link: function (scope, element, attrs) {
                $ionicGesture.on('tap', function (e) {

                    /* Grab all list items -Content and Buttons */
                    var list = document.querySelector('.vlist');
                    var contentarray = list.querySelectorAll(".item-content");
                    var buttonsarray = list.querySelectorAll(".item-options");

                    // Grab the content
                    var content = element[0].querySelector('.item-content');

                    // Grab the buttons and their width
                    var buttons = element[0].querySelector('.item-options');

                    if (!buttons) {
                        console.log('There are no option buttons');
                        return;
                    }
                    var buttonsWidth = buttons.offsetWidth;

                    ionic.requestAnimationFrame(function () {
                        content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

                        //Remove class after 250ms
                        var removeclass = function (item) {
                            setTimeout(function () {
                                item.classList.add('invisible');
                            }, 250);
                        };

                        //Iterate through all contents
                        for (i = 0; i < contentarray.length; i++) {
                            if (!buttonsarray[i].classList.contains('invisible')) {
                                contentarray[i].style[ionic.CSS.TRANSFORM] = '';
                                removeclass(buttonsarray[i]);
                            };
                        };

                        if (!buttons.classList.contains('invisible')) {
                            content.style[ionic.CSS.TRANSFORM] = '';
                            setTimeout(function () {
                                buttons.classList.add('invisible');
                            }, 250);
                        } else {
                            buttons.classList.remove('invisible');
                            content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
                        };
                    });

                }, element);
            }
        };
           }])
    .directive('map', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                console.log(element[0]);

                var myNode = element[0].children;
                console.log(myNode);
                if (myNode != null) {
                    console.log(myNode);
                    while (myNode.firstChild) {
                        myNode.removeChild(myNode.firstChild);
                    };
                };

                var zValue = scope.$eval(attrs.zoom);
                var lat = scope.$eval(attrs.latitude);
                var lng = scope.$eval(attrs.longitude);

                console.log(element[0]);
                map = null;
                var myLatlng = null;
                console.log(map);

                myLatlng = new google.maps.LatLng(lat, lng);

                mapOptions = {
                    zoom: zValue,
                    center: myLatlng
                };

                map = new google.maps.Map(element[0], mapOptions);

                console.log(map);

                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    draggable: true
                });



                google.maps.event.addListener(marker, 'dragend', function (evt) {
                    console.log('Current Latitude:', evt.latLng.lat(), 'Current Longitude:', evt.latLng.lng());
                    scope.$parent.user.latitude = evt.latLng.lat();
                    scope.$parent.user.longitude = evt.latLng.lng();
                    scope.$apply();
                });
            }
        };
    });;
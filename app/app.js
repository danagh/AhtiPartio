'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'duScroll',
    'ngTouch',
    'pascalprecht.translate'
]);

//keep track of the two different routes.
app.config(['$locationProvider', '$routeProvider','$translateProvider', function($locationProvider, $routeProvider, $translateProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider
      .when('/gallery',
          {
              controller: 'galleryController',
              template: 'gallery.html'
          })
      .otherwise({redirectTo: '/'});

    //define the different translations
    //source: https://angular-translate.github.io/docs/#/guide/07_multi-language
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('fi', translationsFI);
    $translateProvider.translations('se', translationsSE);

    //define the default language
    $translateProvider.preferredLanguage('fi');
    $translateProvider.fallbackLanguage('fi');
}]);

//define the main controller
app.controller("mainController", ['$scope', '$rootScope', '$translate',
    function($scope, $rootScope, $translate) {
        //initiate everything to false.
        $scope.showAbout = false;
        $scope.showContact = false;
        $scope.showGallery = false;

        //if about is open close and if it is closed open
        $scope.showAboutPage = function() {
            $scope.showContact = false;
            $scope.showAbout = !$scope.showAbout;
        };


        //if contact is closed open and the reverse otherwise
        $scope.showContactPage = function () {
            $scope.showAbout = false;
            $scope.showContact = !$scope.showContact;
        };

        //if gallery is closed open
        //source: https://stackoverflow.com/questions/30350008/scroll-down-whole-browser-window
        $scope.showGalleryPage = function () {
            $scope.showAbout = false;
            $scope.showContact = false;
            $('html, body').animate({
                scrollTop: $(".gallery-container").offset().top + 'px'
            }, 'slow');

        };

        //if gallery is open then close it and scroll to the menu
        $scope.showMenuAgain = function () {
            $('html, body').animate({
                scrollTop: $(".scroll-anchor").offset().top + 'px'
            }, 'slow');
        };

        //if the middle of the page is clicked then close everything
        $rootScope.$on("documentClicked", _close);

        //function that closes everything
        function _close() {
            $scope.showAbout = false;
            $scope.showContact = false;
            $scope.showGallery = false;
        }

        //initiate language array
        var languages = ['fi', 'se', 'en'];

        //eventhandler to change language on click and add class to selected language
        //source: https://angular-translate.github.io/docs/#/guide/07_multi-language
        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);

            //source: https://stackoverflow.com/questions/28941184/on-click-adding-and-removing-classes-in-angularjs
            //change active language underline.
            angular.forEach(languages, function(item) {
                $scope[item] = (langKey == item);
            });
        };

        //initiate by giving active languages to finnish first.
        $scope.fi = true;

        $scope.images = [
            {
                'url': 'resources/img1.jpeg'
            },
            {
                'url': 'resources/img2.jpg'
            },
            {
                'url': 'resources/img3.jpg'
            },
            {
                'url': 'resources/img4.jpg'
            },
            {
                'url': 'resources/img5.jpg'
            },
            {
                'url': 'resources/img6.jpg'
            },
            {
                'url': 'resources/img7.jpg'
            },
            {
                'url': 'resources/img8.jpg'
            },
            {
                'url': 'resources/img9.jpg'
            },
            {
                'url': 'resources/img10.jpg'
            },
            {
                'url': 'resources/img11.jpg'
            },
            {
                'url': 'resources/img12.jpg'
            },
            {
                'url': 'resources/img13.jpg'
            }
        ];

        //eventlistener that takes the clicked image in the gallery and enhances it
        //source: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal_img
        $scope.enhanceImage = function (image) {
            var modal = document.getElementsByClassName('modal-window')[0];
            modal.style.display = "block";
            var largeImage = document.getElementsByClassName('modal-content')[0];
            largeImage.src = image.url;
        };

        //eventlistener that closes the modal-window with the enlarged image.
        $scope.closeModal = function () {
            var modal = document.getElementsByClassName('modal-window')[0];
            modal.style.display = "none";
            var largeImage = document.getElementsByClassName('modal-content')[0];
            largeImage.src = "";
        };

        //Function that shows the next image in the image gallery when in full screen
        $scope.nextImage = function () {
            var currentImage = document.getElementsByClassName('modal-content')[0];
            var currentImageFullPath = currentImage.src;

            //Cut out everything from the path except the filename.
            //source: https://stackoverflow.com/questions/29182283/javascript-onclick-get-image-name-without-path/29182327
            var currentImageName = currentImageFullPath.split("/").pop().split(".")[0];

            //Cut out everything except the img number from the name
            //source: https://stackoverflow.com/questions/10003683/javascript-get-number-from-string
            var currentImageNumber = parseInt(currentImageName.match(/\d+$/)[0]);
            var nextImage = currentImageNumber + 1;
            var nextImageString = nextImage.toString();

            //If the user presses next on the last image show the first image
            if (nextImage > $scope.images.length ) {
                currentImage.src = $scope.images[0].url;
            }

            else {
                //Loop through all the images and find the next image
                for (var i = 0; i < $scope.images.length; i++) {
                    if ($scope.images[i].url.search(nextImageString) != -1 ) {
                        currentImage.src = $scope.images[i].url;
                        return true;
                    }
                }
            }
        };

        //Function that shows the previous image in the image gallery when in full screen
        $scope.previousImage = function () {
            var currentImage = document.getElementsByClassName('modal-content')[0];
            var currentImageFullPath = currentImage.src;

            //Cut out everything from the path except the filename.
            //source: https://stackoverflow.com/questions/29182283/javascript-onclick-get-image-name-without-path/29182327
            var currentImageName = currentImageFullPath.split("/").pop().split(".")[0];

            //Cut out everything except the img number from the name
            //source: https://stackoverflow.com/questions/10003683/javascript-get-number-from-string
            var currentImageNumber = parseInt(currentImageName.match(/\d+$/)[0]);
            var nextImage = currentImageNumber - 1;
            var nextImageString = nextImage.toString();

            //If the user presses previous image on the first image go to the last image.
            if (nextImage == 0 ) {
                currentImage.src = $scope.images[$scope.images.length -1].url;
            }

            else {
                //Loop through all the images and find the previous image
                for (var i = 0; i < $scope.images.length; i++) {
                    if ($scope.images[i].url.search(nextImageString) != -1 ) {
                        currentImage.src = $scope.images[i].url;
                        return true;
                    }
                }
            }
        }
}]);

// Add eventlistener that checks if the middle of the page is clicked
// source: https://www.codementor.io/angularjs/tutorial/making-a-sliding-menu-with-directives-less-css
app.run(function($rootScope) {
    document.getElementsByClassName('whole-container')[0].addEventListener("click", function(e) {
        //If the clicked element is the container then close everything else. Otherwise don't
        if (e.target.classList.contains('whole-container') || e.target.classList.contains('ahti-img') || e.target.classList.contains('partio-img') || e.target.classList.contains('ahti') || e.target.classList.contains('partio') || e.target.classList.contains('small-screen-close')) {
            $rootScope.$broadcast("documentClicked", e.target)
        }
    });

});

// Function that checks all the gallery images and depending on their size changes them.
// source: https://css-tricks.com/forums/topic/conditionally-resize-image-based-on-width/
app.run(function() {
   $('.img-thumbnail').each(function() {
       if ($(this).width() < 300) {
           $(this).css('width', '300px');
       }
       if ($(this).height() < 300) {
           $(this).css('height', '300px');
       }

   })
});




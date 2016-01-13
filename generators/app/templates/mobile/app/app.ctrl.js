(function () {
    'use strict';

    angular.module('app')
        .controller('AppController', AppController);

    function AppController($ionicSideMenuDelegate) {
        var app = this;

        // functions
        app.toggleNotificationsWindow = toggleNotificationsWindow;

        //////////
        function toggleNotificationsWindow() {
            $ionicSideMenuDelegate.toggleRight();
        }
    }
})();

(function () {
    'use strict';

    // Route Configuration
    angular.module('app')
        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'home/home.html',
                    controller: 'HomeController as vm'
                })

                .state('tab.more', {
                    url: '/more',
                    templateUrl: 'more/more.html',
                    controller: 'MoreController as vm'
                });

            $urlRouterProvider.otherwise(function ($injector) {
                var $state = $injector.get('$state');
                $state.go('home');
            });
        });
})();

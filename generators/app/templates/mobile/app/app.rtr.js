(function () {
    'use strict';

    // Route Configuration
    angular.module('app')
        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

                // setup an abstract state for the tabs directive
                .state('tab', {
                    url: '/tab',
                    abstract: true,
                    templateUrl: 'tabs.html',
                    controller: 'TabController as vm'
                })

                // Each tab has its own nav history stack:
                .state('tab.home', {
                    url: '/home',
                    views: {
                        'tab-home': {
                            templateUrl: 'home/home.html',
                            controller: 'HomeController as vm'
                        }
                    }
                })

                .state('tab.more', {
                    url: '/more',
                    views: {
                        'tab-more': {
                            templateUrl: 'more/more.html',
                            controller: 'MoreController as vm'
                        }
                    }
                });


            // If none of the above states are matched, use this as the fallback...
            // The function call approach is necessary to prevent a infinite digest cycle
            // under certain conditions (browsing to / for example). Don't change this to the
            // simpler version of 'otherwise'. Otherwise - you'll break it again!!
            $urlRouterProvider.otherwise(function ($injector) {
                var $state = $injector.get('$state');
                $state.go('tab.home');
            });
        });
})();

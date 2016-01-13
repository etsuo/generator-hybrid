(function () {
    'use strict';

    angular.module('app.components')
        .directive('yghMobileExample', yghMobileExample);

    function yghMobileExample() {
        return {
            scope: {},
            controller: exampleMobileController,
            controllerAs: 'vm',
            bindToController: {},
            restrict: 'E',
            templateUrl: 'components/exampleMobileDirective/example.html',
            link: link
        };

        //////////
        function exampleMobileController() {
            var vm = this;

            // properties
            vm.message = 'mobile passed';

            // functions

            // events

            // init

            //////////
        }

        function link() {
        }

    }
})();

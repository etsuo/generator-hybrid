(function () {
    'use strict';

    angular.module('app.components')
        .directive('yghWebExample', yghWebExample);

    function yghWebExample() {
        return {
            scope: {},
            controller: exampleWebController,
            controllerAs: 'vm',
            bindToController: {},
            restrict: 'E',
            templateUrl: 'components/exampleWebDirective/example.html',
            link: link
        };

        //////////
        function exampleWebController() {
            var vm = this;

            // properties
            vm.message = 'web passed';

            // functions

            // events

            // init

            //////////
        }

        function link() {
        }

    }
})();

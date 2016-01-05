(function () {
    'use strict';

    angular.module('app.common.components')
        .directive('yghCommonExample', yghCommonExample);

    function yghCommonExample() {
        return {
            scope: {},
            controller: exampleCommonController,
            controllerAs: 'vm',
            bindToController: {},
            restrict: 'E',
            templateUrl: 'components/exampleCommonDirective/example.html',
            link: link

        };

        //////////
        function exampleCommonController() {
            var vm = this;

            // properties
            vm.message = 'common passed';

            // functions
            // events
            // init
        }

        function link() {
        }
    }
})();

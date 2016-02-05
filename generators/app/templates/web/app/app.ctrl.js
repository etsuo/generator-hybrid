(function () {
    'use strict';

    angular.module('app')
        .controller('AppController', AppController);

    function AppController() {
        var vm = this;

        vm.diagnostic = 'If you see this message, your app is wired up and the view is binding to its model.';
    }
})();

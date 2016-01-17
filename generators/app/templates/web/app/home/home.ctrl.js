(function () {
    'use strict';

    angular.module('app.home')
        .controller('HomeController', HomeController);

    function HomeController() {
        var vm = this;

        vm.diagnostic = 'If you see this message, your app is wired up and the view is binding to its model.';

    }

})();

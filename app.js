(function () {
    'use strict'

    angular.module("NarrowItDownApp", [])
        .controller("NarrowItDownController", NarrowItDownController)
        .directive("foundItems", FoundItemsDirective)
        .service("MenuSearchService", MenuSearchService);

    NarrowItDownController.$inject = ["MenuSearchService"];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        ctrl.searchTerm = "";
     //   ctrl.found = [];

        ctrl.narrowDown = function () {
            ctrl.found = [];
            if (ctrl.searchTerm.trim().length === 0) {
                return;
            }
            var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
            promise.then(function (response) {
                var menus = response.data.menu_items;
                ctrl.found = [];
                angular.forEach(menus, function (menu) {
                    if (menu.description.indexOf(ctrl.searchTerm) !== -1)
                        ctrl.found.push(menu);
                }); 
            });
        };

        ctrl.remove = function (index) {
            ctrl.found.splice(index, 1);
        };
    };

    MenuSearchService.$inject = ["$http"];
    function MenuSearchService($http) {
        var svc = this;

        svc.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: 'GET',
                url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
            });
        };
    };

    function FoundItemsDirective() {
        var ddo = {
            restrict:'E',
            templateUrl: 'menuList.html',           
            scope: {
                foundItems: '<',
                onRemove: '&'
            },
            controller: MenuListDirectiveController,
            controllerAs: 'menuCtrl',
            bindToController: true
        };
        return ddo;
    };

    function MenuListDirectiveController() {

    };

})();
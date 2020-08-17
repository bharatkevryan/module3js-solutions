(function (){
	'use strict';
	angular.module("myApp", []).controller("narrowListController", narrowListController)
	.service("narrowListService", narrowListService)
	.service("davidMenuService", davidMenuService)
	.directive("narrowList", NarrowList);

	function NarrowList(){
		var ddo = {
			templateUrl : 'snipp.html',
			scope : {
				list : "=myList"
			}
		};
		return ddo;
	}

	function narrowListController(narrowListService){
		var list = this;
		
		list.searchNarrowList = function (){
			console.log(list.narrow);
			narrowListService.searchItems(list.narrow);
		
			list.itemList = narrowListService.items;
		}
		list.removeItems = function (index){
			list.itemList.splice(index, 1);
		}
		list.isEmptyItems = function (){
			 if (list.itemList !== undefined && list.itemList.length === 0) {
                return true;
            }
            return false;
		}
	}

	function davidMenuService($http){
		var service = this;
		service.getMenuItems = function (){
			var response = $http({
				method : "GET",
				url : "https://davids-restaurant.herokuapp.com/menu_items.json",
				
			});

			return response;
		}
	}

	function narrowListService(davidMenuService){
		var service = this;
		service.items = [];
		service.searchItems = function (searchTerm){
			service.items = [];
			var promise = davidMenuService.getMenuItems(searchTerm);
			promise.
			then(function success(result) {
                if (searchTerm !== undefined && searchTerm.length > 0) {
                    searchTerm = searchTerm.toLowerCase();
                    for (var i = 0; i < result.data.menu_items.length; i++) {
                        var menu_item = result.data.menu_items[i];
                        var description = menu_item.description.toLowerCase();
                        if (description.indexOf(searchTerm) !== -1) {
                            service.items.push(menu_item);
                        }
                    }
                }
                return service.items;
            })
			.catch(function(response){
				console.log("something went wrong!!");
			});

		}
	
	}

})();
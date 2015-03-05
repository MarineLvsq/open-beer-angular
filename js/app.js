angular.module("mainApp",["ngRoute","ngResource","ngAnimate",require("./breweries/breweriesModule"),require("./config/configModule")]).
controller("MainController", ["$scope","$location","save","$window",require("./mainController")]).
controller("SaveController", ["$scope","$location","save",require("./save/saveController")]).
service("rest", ["$http","$resource","$location","config",require("./services/rest")]).
service("save", ["rest","config","$route",require("./services/save")]).
config(["$routeProvider","$locationProvider","$httpProvider",require("./config")]).
filter("NotDeletedFilter",require("./addons/notDeletedFilter")).
directive("sortBy", [require("./addons/sortBy")]).
directive("Drag",require("./addons/drag")).
directive("bsModal",["$q",require("./addons/modal")]).
service("modalService",["$q","$compile","$rootScope","$sce",require("./addons/modalService")]).
run(['$rootScope','$location', '$routeParams', function($rootScope, $location, $routeParams) {
	$rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
		var paths=$location.path().split("/");
		var result=new Array();
		var href="";
		for(var i in paths){
			var p={};
			if(paths[i]){
				p.caption=paths[i];
				if(i<paths.length-1){
					p.href=href+paths[i]+"/";
					href+=paths[i];
				}else{
					p.href="";
				}
				result.push(p);
			}
		}
		$rootScope.paths=result;
	});
}]
).factory("config", function() {
	var factory={breweries:{},server:{}};
	factory.activeBrewery=undefined;
	factory.breweries.loaded=false;
	factory.breweries.refresh="ask";
	factory.breweries.update="deffered";
	factory.server.privateToken="";
	factory.server.mashapeKey="";
	factory.server.restServerUrl="https://community-open-beer-database.p.mashape.com/";
	return factory;
});

angular.module("mainApp",["ngRoute","ngResource","ngAnimate",require("./breweries/breweriesModule"),require("./config/configModule")]).
controller("MainController", ["$scope","$location",require("./mainController")]).
service("rest", ["$http","$resource","$location","config",require("./services/rest")]).
service("save", ["rest","config","$route",require("./services/save")]).
config(["$routeProvider","$locationProvider","$httpProvider",require("./config")]).
filter("NotDeletedFilter",require("./addons/notDeletedFilter")).
directive("sortBy", [require("./addons/sortBy")]).
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
	var factory={breweries:{}};
	factory.activeBrewery=undefined;
	factory.breweries.loaded=false;
	factory.breweries.refresh="ask";
	factory.breweries.update="deffered";
	factory.privateToken="fb84484ec43843902c957293e247c01afb5b439c6825cbaa498a111422dc7b92";
	factory.mashapeKey="lqafJTJ2lrmshnnjLI7ZXXvF7eEAp1qg93rjsnzYisiGEKvXKz";
	factory.restServerUrl="https://community-open-beer-database.p.mashape.com/";
	return factory;
});

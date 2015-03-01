var appBreweries=angular.module("BreweriesApp", []).
controller("BreweriesController", ["$scope","rest","$timeout","$location","config","$route","save",require("./breweriesController")]).
controller("BreweryUpdateController",["$scope","config","$location","rest","save","$document","modalService",require("./breweryUpdateController")]);
module.exports=angular.module("BreweriesApp").name;
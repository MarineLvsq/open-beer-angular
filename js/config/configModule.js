var configApp=angular.module("ConfigApp", []).
controller("ConfigController", ["$scope","config","$location",require("./configController")]);
module.exports=configApp.name;
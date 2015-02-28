var configApp=angular.module("ConfigApp", []).
controller("ConfigController", ["$scope","config",require("./configController")]);
module.exports=configApp.name;
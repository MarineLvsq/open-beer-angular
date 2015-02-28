(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports= function() {
	return function( items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if(!item.deleted) {
                filtered.push(item);
            }
        });
        return filtered;
    };
};
},{}],2:[function(require,module,exports){
module.exports=function(){
	return {
		restrict: "A",
		scope: {field:"@",ref:"="},
		templateUrl: 'js/addons/templates/sortBy.html',
		transclude: true,
		replace:false,
		controller: function ($scope) {
			$scope.sortByField=undefined;
			$scope.asc=true;
			if($scope.immediatly){
				$scope.sortBy();
			}
			$scope.isAlt=function(){
				var result="";
				if($scope.isSortByMe){
					if(!$scope.ref.asc){
						result="-alt";
					}
				}
				return result;
			};
			$scope.sortBy=function(){
				if(angular.isUndefined($scope.sortByField)){
					$scope.asc=true;
				}else{
					$scope.asc=!$scope.asc;
				}
				$scope.sortByField=$scope.field;
				$scope.ref.field=$scope.field;
				$scope.ref.asc=$scope.asc;
			};
			$scope.isSortByMe=function(){
				return $scope.ref.field===$scope.field;
			};
		}
	};
};
},{}],3:[function(require,module,exports){
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

},{"./addons/notDeletedFilter":1,"./addons/sortBy":2,"./breweries/breweriesModule":5,"./config":7,"./config/configModule":9,"./mainController":10,"./services/rest":11,"./services/save":12}],4:[function(require,module,exports){
module.exports=function($scope,rest,$timeout,$location,config,$route,save) {
	$scope.data={load:false};

	$scope.sortBy={field:"name",asc:false};
	
	$scope.messages=rest.messages;
	
	if(config.breweries.refresh==="all" || !config.breweries.loaded){
		$scope.data.load=true;
		rest.getAll($scope.data,"breweries");
		config.breweries.loaded=true;
	}else{
		$scope.data["breweries"]=config.breweries.all;
	}
	$scope.allSelected=false;
	
	$scope.selectAll=function(){
		angular.forEach($scope.data.breweries, function(value, key) {
			value.selected=$scope.allSelected;
		});
	};
	
	$scope.refresh=function(){
		save.executeAll();
		//config.breweries.loaded=false;
		//$route.reload();
	}
	
	$scope.showUpdate=function(){
		return angular.isDefined($scope.activeBrewery);
	};
	
	$scope.refreshOnAsk=function(){
		return config.breweries.refresh == 'ask';
	};
	
	$scope.defferedUpdate=function(){
		return config.breweries.update == 'deffered';
	};
	
	$scope.setActive=function(brewery){
		brewery.active=!brewery.active;
		if(brewery.active){
			if(angular.isDefined($scope.activeBrewery)){
				$scope.activeBrewery.active=false;
			}
			$scope.activeBrewery=brewery;
		}else{
			$scope.activeBrewery=undefined;
		}
		config.activeBrewery=$scope.activeBrewery;
	};
	
	$scope.hasMessage=function(){
		return rest.messages.length>0;
	};
	
	$scope.readMessage=function(message){
		$timeout(function(){
			message.deleted=true;
		},5000);
		return true;
	}
	
	$scope.countSelected=function(){
		var result=0;
		angular.forEach($scope.data.breweries, function(value, key) {
			if(value.selected)
				result++;
		});
		return result;
	};
	
	$scope.hideDeleted=function(){
		$scope.mustHideDeleted=!$scope.mustHideDeleted;
		angular.forEach($scope.data.breweries, function(value, key) {
			if($scope.mustHideDeleted){
				if(value.flag==='Deleted')
					value.deleted=true;
			}else{
				value.deleted=false;
			}
		});
	};
	
	$scope.edit=function(){
		config.activeBrewery=angular.copy($scope.activeBrewery);
		config.activeBrewery.reference=$scope.activeBrewery;
		$location.path("breweries/update");
	}
	
	$scope.update=function(brewery,force,callback){
		if(angular.isUndefined(brewery)){
			brewery=$scope.activeBrewery;
		}
		$scope.data.posted={ "brewery" : {
		    "name" : brewery.name,
		    "url"  : brewery.url
		  }
		};
		$scope.data.breweries.push(brewery);
		brewery.created_at=new Date();
			if(config.breweries.update==="immediate" || force){
				rest.post($scope.data,"breweries",brewery.name,callback);
			}else{
				save.addOperation($scope.update,brewery);
				brewery.flag="New";
				$location.path("breweries");
			}
	}
	
	$scope.remove=function(){
		angular.forEach($scope.data.breweries, function(value, key) {
			if(value.selected){
				$scope.removeOne(value);
			}
		});
		return true;
	};
	$scope.removeOne=function(brewery,force,callback){
		if(config.breweries.update==="immediate" || force){
			brewery.deleted=true;
			rest.remove(brewery,"breweries",callback);
		}else{
			save.addOperation($scope.removeOne,brewery);
			brewery.deleted=$scope.hideDeleted;
			brewery.flag="Deleted";
		}
	}
};
},{}],5:[function(require,module,exports){
var appBreweries=angular.module("BreweriesApp", []).
controller("BreweriesController", ["$scope","rest","$timeout","$location","config","$route","save",require("./breweriesController")]).
controller("BreweryUpdateController",["$scope","config","$location","rest","save",require("./breweryUpdateController")]);
module.exports=angular.module("BreweriesApp").name;
},{"./breweriesController":4,"./breweryUpdateController":6}],6:[function(require,module,exports){
module.exports=function($scope,config,$location,rest,save){
	$scope.data={};
	if(angular.isUndefined(config.activeBrewery)){
		$location.path("breweries/");
	}
	$scope.activeBrewery=config.activeBrewery;
	
	$scope.update=function(brewery,force,callback){
		if(angular.isUndefined(brewery)){
			brewery=$scope.activeBrewery;
		}else{
			config.activeBrewery=angular.copy(brewery);
			config.activeBrewery.reference=brewery;
		}
		$scope.data.posted={ "brewery" : {
		    "name" : brewery.name,
		    "url"  : brewery.url
		  }
		};
		
		config.activeBrewery.reference.name=$scope.activeBrewery.name;
		config.activeBrewery.reference.url=$scope.activeBrewery.url;
		config.activeBrewery.reference.updated_at=new Date();
		
		if(config.breweries.update==="immediate" || force)
			rest.put(config.activeBrewery.id,$scope.data,"breweries",config.activeBrewery.name,callback);
		else{
			save.addOperation($scope.update,brewery);
			config.activeBrewery.reference.flag="Updated";
			$location.path("breweries");
		}
	}
};
},{}],7:[function(require,module,exports){
module.exports=function($routeProvider,$locationProvider,$httpProvider) {
	//$httpProvider.defaults.useXDomain = true;
	//$httpProvider.defaults.withCredentials = true;
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	$routeProvider.
	when('/', {
		templateUrl: 'templates/main.html',
		controller: 'MainController'
	}).when('/breweries', {
		templateUrl: 'templates/breweries/main.html',
		controller: 'BreweriesController'
	}).when('/breweries/refresh', {
		templateUrl: 'templates/breweries/main.html',
		controller: 'BreweriesController'
	}).when('/breweries/new', {
		templateUrl: 'templates/breweries/breweryForm.html',
		controller: 'BreweriesController'
	}).when('/breweries/update', {
		templateUrl: 'templates/breweries/breweryForm.html',
		controller: 'BreweryUpdateController'
	}).when('/config', {
		templateUrl: 'templates/config.html',
		controller: 'ConfigController'
	}).otherwise({
		redirectTo: '/'
	});
	if(window.history && window.history.pushState){
		$locationProvider.html5Mode(true);
	}
};
},{}],8:[function(require,module,exports){
module.exports=function($scope,config){
	$scope.config=config;
};
},{}],9:[function(require,module,exports){
var configApp=angular.module("ConfigApp", []).
controller("ConfigController", ["$scope","config",require("./configController")]);
module.exports=configApp.name;
},{"./configController":8}],10:[function(require,module,exports){
module.exports=function($scope,$location) {

};
},{}],11:[function(require,module,exports){
module.exports=function($http,$resource,$location,restConfig) {
	var self=this;
	if(angular.isUndefined(this.messages))
		this.messages=new Array();
	this.privateToken=restConfig.privateToken;
	this.headers={ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
	    	'X-Mashape-Key': restConfig.mashapeKey,
	    	'Accept': 'application/json'
	    	};
	this.getAll=function(response,what){
		var request = $http({
		    method: "GET",
		    url: restConfig.restServerUrl+what+'.json?token='+this.privateToken,
		    headers: {'X-Mashape-Key': restConfig.mashapeKey,
		    	'Accept': 'application/json'
		    	},
		    callback: 'JSON_CALLBACK'
		});
		request.success(function(data, status, headers, config) {
			response[what]=data[what];
			restConfig[what].all=data[what];
			response.load=false;
		}).
		error(function(data, status, headers, config) {
			self.messages.push({type:"danger",content:"Erreur de connexion au serveur, statut de la réponse : "+status});
			console.log("Erreur de connexion au serveur, statut de la réponse : "+status);
		});
	};
	this.post=function(response,what,name,callback){
		if(angular.isUndefined(callback))
			this.clearMessages();
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		$http.defaults.headers.post["X-Mashape-Key"] = restConfig.mashapeKey;
		$http.defaults.headers.post["Accept"] = "application/json";

		var request = $http({
		    method: "POST",
		    url: restConfig.restServerUrl+what+'.json?token='+this.privateToken,
		    data: $.param(response.posted),
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			self.messages.push({type:"success",content: "'"+name+"' has been correctly added in "+what+"."});
			if(angular.isUndefined(callback)){
				$location.path("/"+what);
			}else{
				callback();
			}
		}).error(function(){
			self.messages.push({type:"warning",content:"Erreur de connexion au serveur, statut de la réponse : "+status});
		});
	};
	
	this.put=function(id,response,what,name,callback){
		if(angular.isUndefined(callback))
			this.clearMessages();
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		$http.defaults.headers.post["X-Mashape-Key"] = restConfig.mashapeKey;
		$http.defaults.headers.post["Accept"] = "text/plain";
		var request = $http({
		    method: "PUT",
		    url: restConfig.restServerUrl+what+'/'+id+'.json?token='+this.privateToken,
		    data: $.param(response.posted),
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			self.messages.push({type:"success",content: "'"+name+"' has been correctly updated in "+what+"."});
			if(angular.isUndefined(callback)){
				$location.path("/"+what);
			}else{
				callback();
			}
		}).error(function(){
			self.messages.push({type:"warning",content:"Erreur de connexion au serveur, statut de la réponse : "+status});
		});
	};
	
	this.remove=function(object,what,callback){
		if(angular.isUndefined(callback))
			this.clearMessages();
		var request = $http({
		    method: "DELETE",
		    url: restConfig.restServerUrl+what+'/'+object.id+'.json?token='+this.privateToken,
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			self.messages.push({type:"success",content:"The "+what+" '"+object.name+"' has been correctly deleted."});
			if(angular.isUndefined(callback)){
				//$location.path("/"+what);
			}else{
				callback();
			}
		}).error(function(){
			self.messages.push({type:"warning",content:"Erreur de connexion au serveur, statut de la réponse : "+status});
		});
	};
	
	this.clearMessages=function(){
		self.messages.length=0;
	};
};
},{}],12:[function(require,module,exports){
module.exports=function(rest,config,$route){
	var self=this;
	this.dataScope={};
	this.operations=[];
	
	this.init=function(data){
		self.dataScope=data;
	};
	
	this.addOperation=function(operation,object){
		self.operations.push({'op':operation,'object':object});
	};
	
	this.execute=function(index){
		var callback;
		if(index+1<self.operations.length){
			callback=function(){
				self.operations.splice(index,1);
				self.execute(index);
			};
		}else{
			callback=function(){
				self.operations.length=0;
				config.breweries.loaded=false;
				$route.reload();
			};
		}
		var operation=self.operations[index];
		operation.op(operation.object,true,callback);
	};
	
	this.executeAll=function(){
		rest.clearMessages();
		if(self.operations.length>0){
			self.execute(0);
		}else{
			config.breweries.loaded=false;
			$route.reload();
		}
	}
};
},{}]},{},[3]);

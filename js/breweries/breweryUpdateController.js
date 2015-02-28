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
			config.activeBrewery.reference.flag="Updated";
			brewery.flag="Updated";
			save.addOperation($scope.update,brewery);
			$location.path("breweries");
		}
	}
};
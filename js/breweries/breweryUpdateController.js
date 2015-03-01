module.exports=function($scope,config,$location,rest,save,$document,modalService){
	$scope.data={};
	if(angular.isUndefined(config.activeBrewery)){
		$location.path("breweries/");
	}
	$scope.activeBrewery=config.activeBrewery;
	
	$scope.setFormScope=function(form){
		$scope.frmBrewery=form;
	};
	var onRouteChangeOff=$scope.$on('$locationChangeStart', function routeChange(event, newUrl, oldUrl) {
	    if (!$scope.frmBrewery || !$scope.frmBrewery.$dirty) return;
	    
	    var alert = modalService.showModal(function(value){
		    	if(value=="Continuer"){
		    		console.log(value);
		    		onRouteChangeOff();
		    		$location.path($location.url(newUrl).hash());
		    	}
	    	}
	    );
	    event.preventDefault();
	    return;
	});
	
	$scope.update=function(brewery,force,callback){
		if($scope.frmBrewery.$dirty){
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
				save.addOperation("Updated",$scope.update,config.activeBrewery.reference);
				$location.path("breweries");
			}
		}else{
			$location.path("breweries");
		}
	}
};
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
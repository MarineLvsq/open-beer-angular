module.exports=function($scope,config,$location){

	$scope.config=angular.copy(config);
	
	$scope.setFormScope=function(form){
		$scope.frmConfig=form;
	};
	
	$scope.update=function(){
		if($scope.frmConfig.$dirty){
			config.server=$scope.config.server;
			config.breweries=$scope.config.breweries;
			config.beers=$scope.config.beers;
		}
		$location.path("/");
	};
	$scope.cancel=function(){
		$location.path("/");
	};
};
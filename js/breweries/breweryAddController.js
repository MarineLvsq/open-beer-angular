module.exports=function($scope,config,$location,rest,save,$document,modalService) {
	
	$scope.data={};
	$scope.data["breweries"]=config.breweries.all;
	var self=this;
	var selfScope=$scope;
	$scope.setFormScope=function(form){
		$scope.frmBrewery=form;
	};
	var onRouteChangeOff=$scope.$on('$locationChangeStart', function routeChange(event, newUrl, oldUrl) {
		if (!$scope.frmBrewery || !$scope.frmBrewery.$dirty || $scope.exit) return;

		var alert = modalService.showModal("Sortie","<b>Attention</b>, si vous continuez, vous perdez les modifications en cours.<br>Enregistrer avant sortie ?",function(value){
				selfScope.exit=true;
				if(value=="Enregistrer et continuer"){
					onRouteChangeOff();
					if(selfScope._update()==true){
						$location.path(newUrl.substring($location.absUrl().length - $location.url().length));
					}
				}else if(value=="Continuer"){
					console.log(value);
					onRouteChangeOff();
					$location.path(newUrl.substring($location.absUrl().length - $location.url().length));
				}
			}
		);
		event.preventDefault();
		return;
	});
	
	$scope.update=function(brewery,force,callback){
		if($scope._update(brewery,force,callback)==true){
			$location.path("breweries");
		}
	};
	$scope._update=function(brewery,force,callback){
		var result=false;
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
			save.addOperation("New",$scope.update,brewery);
			result=true;
		}
		return result;
	}
};
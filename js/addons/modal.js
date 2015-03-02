module.exports=function($q) {
	return {
		restrict:'E',
		scope : {title: "@",buttons: "=",did: "@",show: "=",onExit: "&"},
		templateUrl: 'js/addons/templates/modal.html',
		transclude: true,
		replace:true,
		controller:function($scope){
			$scope.isDismiss=function(button){
				result="";
				if(button.dismiss=="true" || button.dismiss===true)
					result='modal';
				return result;
			}
		},
		link:function($scope, tElem, tAttrs) {
			$scope.deferred = $q.defer();
			$scope.deferred.promise.then(function(value){
				$scope.onExit({button:value});
			});
			
			if($("#"+$scope.did).length)
				$("#"+$scope.did).modal();
			
			$scope.$watch('show', function(oldVal, newVal) {
				if(newVal===true)
					$("#"+$scope.did).modal('show');
				else
					$("#"+$scope.did).modal('hide');
			});
			
			angular.forEach($scope.buttons, function(button, index) {
				$("#"+$scope.did+"-"+index).click(function(){
					//$scope.value=button.caption;
					$scope.deferred.resolve(button.caption);
					//alert(button.caption);
					}
				);
			})
		}
	};
};
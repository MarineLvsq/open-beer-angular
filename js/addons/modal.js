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
		link:{
			post: function postLink($scope, tElem, tAttrs) {
				
				if($("#"+$scope.did).length)
					$("#"+$scope.did).modal();
				
				$scope.$watch('show', function(newValue, oldValue) {
					if(newValue===true){
						$("#"+$scope.did).modal('show');
						$scope.deferred = $q.defer();
						$scope.deferred.promise.then(function(value){
							$scope.show=false;
							$scope.onExit({button:value});
						});
					}
					else{
						$("#"+$scope.did).modal('hide');
						//if(angular.isDefined($scope.deferred))
						///	$scope.deferred.reject();
					}
				});
				$scope.iClick=function(button){
					$scope.deferred.resolve(button.caption);
					alert(button.caption);
				};
//				angular.forEach($scope.buttons, function(button, index) {
//					if($("#"+$scope.did+"-"+index).length){
//						$("#"+$scope.did+"-"+index).click(function(){
//							$scope.deferred.resolve(button.caption);
//							alert(button.caption);
//							}
//						);
//					}
//				});
			}
		}
	};
};
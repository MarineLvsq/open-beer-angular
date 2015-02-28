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
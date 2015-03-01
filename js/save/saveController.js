module.exports=function($scope,$location,save){
	$scope.data=save;
	$scope.allSelected=false;
	$scope.sortBy={field:"name",asc:false};
	
	$scope.selectAll=function(){
		angular.forEach($scope.data.operations, function(value, key) {
			value.selected=$scope.allSelected;
		});
	};
	
	$scope.saveAll=function(){
		save.executeAll();
	};
	
	$scope.setActive=function(operation){
		operation.active=!operation.active;
		if(operation.active){
			if(angular.isDefined($scope.activeOperation)){
				$scope.activeOperation.active=false;
			}
			$scope.activeOperation=operation;
		}else{
			$scope.activeOperation=undefined;
		}
		config.activeOperation=$scope.activeOperation;
	};
	
	$scope.countSelected=function(){
		var result=0;
		angular.forEach($scope.data.operations, function(value, key) {
			if(value.selected)
				result++;
		});
		return result;
	};
	
	$scope.remove=function(){
		angular.forEach($scope.data.operations, function(value, key) {
			if(value.selected){
				var index=save.operations.indexOf(value);
				value.object.flag=undefined;
				save.operations.splice(index,1);
			}
		});
		return true;
	};
};
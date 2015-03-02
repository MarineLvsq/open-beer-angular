module.exports=function($scope,$location,save){
	$scope.data=save;
	$scope.allSelected=false;
	$scope.sortBy={field:"type",asc:false};
	
	$scope.selectAll=function(){
		angular.forEach($scope.data.operations, function(value, key) {
			value.selected=$scope.allSelected;
		});
	};
	
	$scope.saveAll=function(){
		save.executeAll();
	};
	
	$scope.setActive=function(operation){
		if(operation!==$scope.activeOperation)
			$scope.activeOperation=operation;
		else
			$scope.activeOperation=undefined;
	};
	$scope.isActive=function(operation){
		return operation==$scope.activeOperation;
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
		save.operations=save.operations.filter(function(op){return !op.selected});
		return true;
	};
};
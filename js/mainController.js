module.exports=function($scope,$location,save) {
	$scope.hasOperations=function(){
		return save.operations.length>0;
	};
	
	$scope.opCount=function(){
		return save.operations.length;
	};
};
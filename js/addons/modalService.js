module.exports=function($q,$compile,$rootScope,$sce){
	
    this.showModal=function(title,content,then){
    	if(angular.isUndefined(this.scope)){
	    	this.scope=$rootScope.$new(true);
    	//}
    	this.scope.buttons=[{caption:"Enregistrer et continuer",dismiss:"true"},{caption:"Continuer",dismiss:"true"},{caption:"Annuler",dismiss:"true"}];
    	this.scope.then=then;
    	this.scope.title=title;
    	this.scope.content=$sce.trustAsHtml(content);
    	var elm=angular.element('<bs-modal did="id-dialog" on-exit="then(button)" buttons="buttons" show="showDialog" title="{{title}}"><div data-ng-bind-html="content"></div></bs-modal>');
    	$compile(elm)(this.scope);
    	//scope.$apply();
    	if(!$("#id-dialog").length)
    		angular.element($("body")).append(elm);
//			$("#id-dialog").on('hide.bs.modal', function() {
//				this.scope.showDialog=false;
//			});
    	}
    	this.scope.showDialog=true;
    }
};
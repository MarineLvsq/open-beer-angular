module.exports=function($q,$compile,$rootScope){
	
    this.showModal=function(then){
    	//if(angular.isUndefined(this.scope)){
	    	this.scope=$rootScope.$new(true);
    	//}
    	this.scope.buttons=[{caption:"Enregistrer et continuer",dismiss:"true"},{caption:"Continuer",dismiss:"true"},{caption:"Annuler",dismiss:"true"}];
    	this.scope.then=then;
    	var elm=angular.element('<bs-modal did="id-dialog" on-exit="then(button)" buttons="buttons" show="showDialog" title="Fermeture de l\'application"><b>Contenu</b> du dialog</bs-modal>');
    	$compile(elm)(this.scope);
    	//scope.$apply();
    	if(!$("#id-dialog").length)
    		angular.element($("body")).append(elm[0]);
    	
    	this.scope.showDialog=true;
    }
};
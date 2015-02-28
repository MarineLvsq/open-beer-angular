module.exports=function($http,$resource,$location,restConfig) {
	var self=this;
	if(angular.isUndefined(this.messages))
		this.messages=new Array();
	this.privateToken=restConfig.privateToken;
	this.headers={ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
	    	'X-Mashape-Key': restConfig.mashapeKey,
	    	'Accept': 'application/json'
	    	};
	this.getAll=function(response,what){
		var request = $http({
		    method: "GET",
		    url: restConfig.restServerUrl+what+'.json?token='+this.privateToken,
		    headers: {'X-Mashape-Key': restConfig.mashapeKey,
		    	'Accept': 'application/json'
		    	},
		    callback: 'JSON_CALLBACK'
		});
		request.success(function(data, status, headers, config) {
			response[what]=data[what];
			restConfig[what].all=data[what];
			response.load=false;
		}).
		error(function(data, status, headers, config) {
			self.messages.push({type:"danger",content:"Erreur de connexion au serveur, statut de la réponse : "+status});
			console.log("Erreur de connexion au serveur, statut de la réponse : "+status);
		});
	};
	this.post=function(response,what,name,callback){
		if(angular.isUndefined(callback))
			this.clearMessages();
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		$http.defaults.headers.post["X-Mashape-Key"] = restConfig.mashapeKey;
		$http.defaults.headers.post["Accept"] = "application/json";

		var request = $http({
		    method: "POST",
		    url: restConfig.restServerUrl+what+'.json?token='+this.privateToken,
		    data: $.param(response.posted),
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			self.messages.push({type:"success",content: "'"+name+"' has been correctly added in "+what+"."});
			if(angular.isUndefined(callback)){
				$location.path("/"+what);
			}else{
				callback();
			}
		}).error(function(){
			self.messages.push({type:"warning",content:"Erreur de connexion au serveur, statut de la réponse : "+status});
		});
	};
	
	this.put=function(id,response,what,name,callback){
		if(angular.isUndefined(callback))
			this.clearMessages();
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		$http.defaults.headers.post["X-Mashape-Key"] = restConfig.mashapeKey;
		$http.defaults.headers.post["Accept"] = "text/plain";
		var request = $http({
		    method: "PUT",
		    url: restConfig.restServerUrl+what+'/'+id+'.json?token='+this.privateToken,
		    data: $.param(response.posted),
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			self.messages.push({type:"success",content: "'"+name+"' has been correctly updated in "+what+"."});
			if(angular.isUndefined(callback)){
				$location.path("/"+what);
			}else{
				callback();
			}
		}).error(function(){
			self.messages.push({type:"warning",content:"Erreur de connexion au serveur, statut de la réponse : "+status});
		});
	};
	
	this.remove=function(object,what,callback){
		if(angular.isUndefined(callback))
			this.clearMessages();
		var request = $http({
		    method: "DELETE",
		    url: restConfig.restServerUrl+what+'/'+object.id+'.json?token='+this.privateToken,
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			self.messages.push({type:"success",content:"The "+what+" '"+object.name+"' has been correctly deleted."});
			if(angular.isUndefined(callback)){
				//$location.path("/"+what);
			}else{
				callback();
			}
		}).error(function(){
			self.messages.push({type:"warning",content:"Erreur de connexion au serveur, statut de la réponse : "+status});
		});
	};
	
	this.clearMessages=function(){
		self.messages.length=0;
	};
};
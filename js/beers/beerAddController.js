module.exports=function($scope,config,$location,rest,save,$document,modalService) {

    $scope.data={};
    $scope.data["beers"]=config.beers.all;
    var self=this;
    var selfScope=$scope;
    $scope.setFormScope=function(form){
        $scope.frmBeer=form;
    };
    var onRouteChangeOff=$scope.$on('$locationChangeStart', function routeChange(event, newUrl, oldUrl) {
        if (!$scope.frmBeer || !$scope.frmBeer.$dirty || $scope.exit) return;

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

    $scope.update=function(beer,force,callback){
        if($scope._update(beer,force,callback)==true){
            $location.path("beers");
        }
    };
    $scope._update=function(beer,force,callback){
        var result=false;
        if(angular.isUndefined(beer)){
            beer=$scope.activeBeer;
        }
        $scope.data.posted={ "beer" : {
            "name" : beer.name,
            "description"  : beer.description
        }
        };
        $scope.data.beers.push(beer);
        beer.created_at=new Date();
        if(config.beers.update==="immediate" || force){
            rest.post($scope.data,"beers",beer.name,callback);
        }else{
            save.addOperation("New",$scope.update,beer);
            result=true;
        }
        return result;
    }
};
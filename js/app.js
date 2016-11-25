angular.module('app', ["ngResource"])  
  .controller('CatsCtrl', function($scope, $http, $resource) {
    $scope.catsResource = $resource(
      'http://rest.daspot.ru/api/AKfycbyFtzb8CwTvErZ_h0b0TJhObbckPhlApiaf1JKjH3EEzhCdSX4/cats/:id', 
      { id:'@id' }, 
      { // because a response data are in the object named cat
        query: {
          transformResponse: function(data){
            return angular.fromJson(data).cat;
          }, 
          isArray: true
        }, 
        save: {
          method: 'POST', 
          transformResponse: function(data){          
            return angular.fromJson(data).cat;
          }
        }
      }
    );
    $scope.cats = $scope.catsResource.query();
    $scope.new = {name: '', age: ''};
    $scope.create = function() {
      var name = $scope.new.name, 
          age = $scope.new.age;
      if (name.length === 0) {
        return;
      }
      new $scope.catsResource({name: name, age: age}).$save().then(function(newCat) {
        $scope.cats.push(newCat);
        $scope.new = {name: '', age: ''};
      });      
    };
  })
  .directive('editItem', function($timeout) {
    return {
      scope: true, 
      link: function(scope, element) {        
        scope.edit = function() {         
          scope.isEditing = true;
          $timeout(function() {
            element.find('input')[0].focus();
          }, 0, false);
        };
        scope.update = function(cat) {
          if(cat.name.length === 0) {
            return scope.remove(cat);
          }      
          cat.$save();
          scope.isEditing = false;
        };
        scope.remove = function(cat) {
          cat.$delete().then(function () {
            scope.cats.splice(scope.cats.indexOf(cat), 1);
          });
        };        
      }
    };
  });

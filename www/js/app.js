// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function() {
  var app = angular.module('starter', ['ionic', 'angularMoment']);

  app.factory('redditFactory', ['$http', function($http) {
    return {
      buscar: function(value, params, callback) {
        $http.get('https://www.reddit.com/r/' + value + '/new/.json', {
          params: params
        }).then(function(stories) {
          var storiesBuscadas = [];
          if (stories.status == 200) {
            for (aux of stories.data.data.children) {
              if (!aux.data.thumbnail || aux.data.thumbnail == 'self' || aux.data.thumbnail == 'default') {
                aux.data.thumbnail = 'https://www.redditstatic.com/icon.png';
              }
              storiesBuscadas.push(aux.data);
            }
          }
          callback(storiesBuscadas);
        }).catch(function(err) {
          console.log(err);
        });
      }
    };
  }]);

  app.controller('redditCtrl', ['$scope', '$http', '$ionicSideMenuDelegate', 'redditFactory', function($scope, $http, $ionicSideMenuDelegate, redditFactory) {
    var palavraAtual = 'ionic';
    $scope.stories = [];

    redditFactory.buscar(palavraAtual, null, function(stories) {
      $scope.stories = stories;
    });

    $scope.buscarPalavra = function() {
      $scope.stories = [];
      palavraAtual = $scope.search.value;
      $scope.search.status = 'Nenhuma notícia foi encontrada.';
      redditFactory.buscar(palavraAtual, null, function(stories) {
        $scope.stories = stories;
      });
    };

    $scope.loadOlderStories = function() {
      var params = {};
      if ($scope.stories.length > 0) {
        params['after'] = $scope.stories[$scope.stories.length - 1].name;
      }
      redditFactory.buscar(palavraAtual, params, function(olderStories) {
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.loadNewerStories = function() {
      var params = {
        'before': $scope.stories[0].name
      };
      redditFactory.buscar(palavraAtual, params, function(newerStories) {
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

  }]);

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
}());

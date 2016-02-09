(function() {

	angular.module('countryAutocompleteApp', []).controller('countryController', function($scope, $http){
		
		$scope.activeCountry = -1;
		$scope.countrySearchTerm = '';
		$scope.pickedCountry = '';
		$scope.countryList = [];

		$http.get('country-list.json').then(function(res){
			$scope.countryList = res.data.countries;
		});

		$scope.countrySearch = function() {
			var result = '!';
			if ($scope.countrySearchTerm != '') {
				if ($scope.countrySearchTerm != $scope.pickedCountry) {
					result = $scope.countrySearchTerm;
				};
			};
			return result;
		};

		$scope.checkKeyPresses = function(e) {
			if (e === 40) {
				$scope.activeCountry++;
				if ($scope.activeCountry === $scope.filtered.length) {
					$scope.activeCountry--;
				};
			} else if (e === 38) {
				$scope.activeCountry--;
				if ($scope.activeCountry === -1) {
					$scope.activeCountry++;
				};
			} else if (e === 13 && $scope.activeCountry > -1) {
				$scope.pickCountry($scope.filtered[$scope.activeCountry].longname);
				$scope.activeCountry = -1;
			} else {
				$scope.activeCountry = -1;
			};
		};

		$scope.pickCountry = function(country) {
			$scope.countrySearchTerm = country;
			$scope.pickedCountry = country;
		};

	});

})();
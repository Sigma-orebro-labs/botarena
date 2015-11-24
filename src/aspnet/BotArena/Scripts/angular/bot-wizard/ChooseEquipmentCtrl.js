angular.module('menuApp').controller('chooseEquipmentCtrl', ['$scope', function ($scope) {

        $scope.equipmentSelect = {
            availableEquipment: [
                { id: '1', name: 'Pirate canon' },
                { id: '2', name: 'Big Bertha' },
                { id: '3', name: 'Sniper rifle' }
            ]
        };
    }
]);
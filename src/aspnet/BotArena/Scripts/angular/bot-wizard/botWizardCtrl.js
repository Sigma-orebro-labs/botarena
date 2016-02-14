angular.module('menuApp').controller('botWizardCtrl', ['$scope', '$http', '$state', 'notificationService', function($scope, $http, $state, notificationService) {

        $scope.bot = {
            className: "", 
            equipment: null,
            colorHexCode: "#FF0000",
            name: ""
        };

        $scope.botInitialStats = {
            hp: 100,
            armor: 1,
            damage: 10,
            firingspeed: 25,
            speed: 1,
            rotationSpeed: 1
        }

        $scope.barWidths = function () {

            var baseFactor = 50; // percent

            return {
                hp: baseFactor * $scope.botStatsMultiplier().hp,
                armor: baseFactor * $scope.botStatsMultiplier().armor,
                damage: baseFactor * $scope.botStatsMultiplier().damage,
                firingspeed: baseFactor * $scope.botStatsMultiplier().firingspeed,
                speed: baseFactor * $scope.botStatsMultiplier().speed,
                rotationSpeed: baseFactor * $scope.botStatsMultiplier().rotationSpeed
            }
        }

        $scope.botStatsMultiplier = function () {

            var userOptions = {
                botClass: $scope.bot.className,
                equipment: [
                    $scope.bot.weapon,
                    $scope.bot.armor,
                    $scope.bot.equipment
                ]
            };

            var botOptions = gosuArena.factories.createSafeBotOptions(userOptions);

            var currentMultipliers = {
                hp: botOptions.staticModifiers.calculateHealthPointFactor(),
                armor: botOptions.staticModifiers.calculateDamageReductionFactor(),
                damage: botOptions.staticModifiers.calculateWeaponDamageFactor(),
                firingspeed: 1 / botOptions.staticModifiers.calculateWeaponCooldownTimeFactor(), // Invert the value to go from cooldown time to firing speed
                speed: botOptions.staticModifiers.calculateMovementSpeedFactor(),
                rotationSpeed: botOptions.staticModifiers.canculateRotationSpeedFactor()
            };

            return currentMultipliers;
        }

        $scope.botStats = function() {
            return {
                hp: $scope.botInitialStats.hp * $scope.botStatsMultiplier().hp,
                armor: $scope.botInitialStats.armor * $scope.botStatsMultiplier().armor,
                damage: $scope.botInitialStats.damage * $scope.botStatsMultiplier().damage,
                firingspeed: $scope.botInitialStats.firingspeed * $scope.botStatsMultiplier().firingspeed,
                speed: $scope.botInitialStats.speed * $scope.botStatsMultiplier().speed,
                rotationSpeed: $scope.botInitialStats.rotationSpeed * $scope.botStatsMultiplier().rotationSpeed
            }
        }

        $scope.user = {
            email: ""
        }

        $scope.currentMesh = null;
        $scope.allMeshes = {
            standardClass: null,
            tank: null,
            ninja: null
        };
        $scope.water = null;

        $scope.init = function () {
            
            var rotation = 0.0;

            var canvas = document.getElementById("bot-wizard-canvas");
            gosuArena.visualizers.menuVisualizer = new BABYLON.Engine(canvas, true);
            var engine = gosuArena.visualizers.menuVisualizer;

            var scene = new BABYLON.Scene(engine);

            var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, Math.PI / 2.5, 20, new BABYLON.Vector3(0, 0, 0), scene);
            camera.upperBetaLimit = Math.PI / 2.05;
            camera.attachControl(canvas, false);

            var light = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-1, -2, -1), scene);
            $scope.setUpWater(scene, light);

            BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "standardClass.babylon", scene, function (meshArray) {
                $scope.setupMesh(meshArray, 'standardClass');
            });

            BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "ninja.babylon", scene, function (meshArray) {
                $scope.setupMesh(meshArray, 'ninja');
            });

            BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "tank.babylon", scene, function (meshArray) {
                $scope.setupMesh(meshArray, 'tank');
            });

            $scope.setupMesh = function (meshArray, meshId) {

                // make sure the babylonjs file consists of a single mesh. Join meshes in Blender by selecting all meshes and pressing Ctrl + J before exporting.
                var mesh = meshArray[0];
                $scope.allMeshes[meshId] = mesh;
                $scope.hideMesh(meshId);

                $scope.water.material.reflectionTexture.renderList.push(mesh);
                $scope.water.material.refractionTexture.renderList.push(mesh);

            }

            engine.runRenderLoop(function () {
                if ($scope.currentMesh) {
                    rotation += 0.01;
                    $scope.currentMesh.rotation = new BABYLON.Vector3(0, rotation, 0);
                }

                scene.render();
            });
        }

        $scope.showMesh = function (meshId) {
            $scope.allMeshes[meshId].position.z = 0;   // move out of sight
        }

        $scope.hideMesh = function (meshId) {
            $scope.allMeshes[meshId].position.z = -99999;   // move out of sight
        }

        $scope.hideAllMeshes = function () {
            for (var i in $scope.allMeshes) {
                $scope.allMeshes[i].position.z = -99999; // move each mesh out of sight
            }
        }

        $scope.changeModelTo = function(meshId) {
            $scope.hideAllMeshes();
            $scope.showMesh(meshId);
        }

        $scope.setUpWater = function (scene, sun) {
            var water = BABYLON.Mesh.CreateGround("water", 100, 100, 1, scene, false);
            var waterMaterial = new gosu.WaterMaterial("water", scene, sun, 0.2, 0.4);

            water.isPickable = false;
            water.material = waterMaterial;
            water.receiveShadows = true;

            $scope.water = water;
        }

        function getValidateSelectedMessage(value, optionName) {
            if (!value) {
                return optionName + '\r\n';
            }

            return '';
        }

        $scope.createBot = function () {

            var missingFields = '';

            missingFields += getValidateSelectedMessage($scope.bot.className, "class");
            missingFields += getValidateSelectedMessage($scope.bot.armor, "armor");
            missingFields += getValidateSelectedMessage($scope.bot.weapon, "weapon");
            missingFields += getValidateSelectedMessage($scope.bot.equipment, "equipment");
            missingFields += getValidateSelectedMessage($scope.bot.augmentation, "augmentation");
            missingFields += getValidateSelectedMessage($scope.bot.colorHexCode, "color");
            missingFields += getValidateSelectedMessage($scope.bot.name, "name");

            if (missingFields) {
                notificationService.showBlockigErrorMessage("Not all options selected", "One or more options have not been selected:\r\n" + missingFields);
                return;
            }

            $http({
                method: "POST",
                url: gosuArena.url.createAbsolute('api/bots'),
                data: {
                    name: $scope.bot.name,
                    colorHexCode: $scope.bot.colorHexCode,
                    className: $scope.bot.className,
                    powerups: [$scope.bot.augmentation],
                    equipment: [$scope.bot.equipment, $scope.bot.weapon, $scope.bot.armor]
                }
            }).then(function (response) {
                notificationService.showSuccessMessage("Bot created", "Your bot has been created, let's write some code!");

                var bot = response.data;

                $state.go("editbot", { botId: bot.id });

            }, function (e) {
                if (e.status === 409) {
                    notificationService.showBlockigErrorMessage("Bot name taken", "The bot name is already taken, please try another name.");
                } else if (e.status === 400 && e.data.message) {
                    notificationService.showBlockigErrorMessage("Validation error", e.data.message);
                } else {
                    notificationService.showUnexpectedErrorMessage(e);
                }
            });
        };
    }
]);
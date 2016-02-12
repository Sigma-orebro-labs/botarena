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
        $scope.allMeshes = [];

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

            BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "ship.babylon", scene, function (meshes1) {
                var mesh = meshes1[1];
                $scope.allMeshes.push(mesh);
            
                mesh.position.x = 0;
                mesh.position.y = 2;
                mesh.position.z = 0;
                
                mesh.scaling = new BABYLON.Vector3(2, 2, 2);

                $scope.setMeshTransparancy(mesh, 0);

                // load next mesh in this callback to force some sort of synchronized load of models since the order of the bots in the $scope.allMeshes matter
                // TODO: Go back to using Magnus ship model here. I had to change to ship.babylon since magnus_skepp.babylon is not properly
                //       committed to the version control. It is included in the project, but is missing on disk.
                BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "ship.babylon", scene, function (meshes) {
                    var tempMaterial = new BABYLON.StandardMaterial("tempMaterial", scene);
                    tempMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.7, 0.1);

                    meshes[0].position.x = 0;
                    meshes[0].position.y = 2;
                    meshes[0].position.z = 0;

                    meshes[0].material = tempMaterial;
                    $scope.allMeshes.push(meshes[0]);
                    $scope.setMeshTransparancy(meshes[0], 0);

                    $scope.setUpWater(scene, light);
                });
            });

            engine.runRenderLoop(function () {
                if ($scope.currentMesh) {
                    rotation += 0.01;
                    $scope.currentMesh.rotation = new BABYLON.Vector3(0, rotation, 0);
                }

                scene.render();
            });
        }
        
        $scope.setMeshTransparancy = function (mesh, value) {
            mesh.material.alpha = value;
            if (mesh.material.subMaterials === undefined)
                return;
            for (var i = 0; i < mesh.material.subMaterials.length; i++) {
                mesh.material.subMaterials[i].alpha = value;
            }
        }

        $scope.showTankModel = function () {
            $scope.currentMesh = $scope.allMeshes[1];
            $scope.setMeshTransparancy($scope.allMeshes[1], 1);
            $scope.setMeshTransparancy($scope.allMeshes[0], 0);
        }

        $scope.showNinjaModel = function () {
            $scope.currentMesh = $scope.allMeshes[0];
            $scope.setMeshTransparancy($scope.allMeshes[1], 0);
            $scope.setMeshTransparancy($scope.allMeshes[0], 1);
        }

        $scope.setUpWater = function (scene, sun) {

            var water = BABYLON.Mesh.CreateGround("water", 100, 100, 1, scene, false);

            var waterMaterial = new gosu.WaterMaterial("water", scene, sun, 0.2, 0.4);

            for (var i = 0; i < $scope.allMeshes.length; i++) {
                waterMaterial.reflectionTexture.renderList.push($scope.allMeshes[i]);
                waterMaterial.refractionTexture.renderList.push($scope.allMeshes[i]);
            }

            water.isPickable = false;
            water.material = waterMaterial;

            water.receiveShadows = true;
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
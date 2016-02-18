//
//  Commonly used functions to handle operations in the babylonjs visualizer
//

var helpers = helpers || {};
helpers.babylon = helpers.babylon || {};

// set color of submaterial having a certain name, on target mesh
helpers.babylon.setMeshColor = function(mesh, hexColor, materialToReplaceName, scene) {
    if (mesh.material && mesh.material.subMaterials) {

        for (var i = 0; i < mesh.material.subMaterials.length; i++) {
            if (mesh.material.subMaterials[i] !== undefined && mesh.material.subMaterials[i].name.indexOf(materialToReplaceName) > -1) {
                mesh.material.subMaterials[i] = helpers.babylon.createColoredMaterial(hexColor, mesh.name + '_' + materialToReplaceName, scene);
            }
        }

    }
}

// create new material and set diffuseColor using hexCode
helpers.babylon.createColoredMaterial = function (hexColor, name, scene) {
    var newMaterial = new BABYLON.StandardMaterial(name, scene);
    newMaterial.diffuseColor = helpers.babylon.hexToColor3(hexColor);
    newMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    return newMaterial;
}

helpers.babylon.hexToRgb = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

helpers.babylon.hexToColor3 = function (hex) {
    var rgb = helpers.babylon.hexToRgb(hex);
    return new BABYLON.Color3(rgb.r / 255, rgb.g / 255, rgb.b / 255);
}
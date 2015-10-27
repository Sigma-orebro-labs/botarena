gosuArena = gosuArena || {};
gosuArena.preloader = gosuArena.preloader || {};

gosuArena.preloader.create = function (scene) {

    var assetsManager = new BABYLON.AssetsManager(scene);

    function load(resourcesToPreload, onFinish, arenaState) {

        //
        //  Expected format of objectsToPreload:
        //
        //  [{name: string, type: string, url: string, callback: function}]   // onfinish ska med här
        //
        //  callback is optional
        //

        for (var i in resourcesToPreload) {

            // creating a new object like below makes a copy. Else all callbacks will reference the callback from the last iteration
            var resource = function (resource) {
                return resource;
            }(resourcesToPreload[i]);
            
            switch (resource.type) {

                // Image
                case 'image':
                    var imageTask = assetsManager.addImageTask("task" + i, gosuArena.url.createAbsolute(resource.url));
                    if (typeof resource.callback !== undefined) {
                        imageTask.onSuccess = resource.callback;
                    }
                    break;

                // Binary
                case 'binary':
                    var binaryTask = assetsManager.addBinaryFileTask("task" + i, gosuArena.url.createAbsolute(resource.url));
                    if (typeof resource.callback !== undefined) {
                        binaryTask.onSuccess = resource.callback;
                    }
                    break;

                // Texture
                case 'texture':
                    var textureTask = assetsManager.addTextureTask("task"+i, gosuArena.url.createAbsolute(resource.url));
                    if (typeof resource.callback !== undefined) {
                        textureTask.onSuccess = resource.callback;
                    }
                    break;

                // Mesh
                case 'mesh':
                    var meshTask = assetsManager.addMeshTask("task" + i, resource.meshes, gosuArena.url.createAbsolute(resource.url), resource.filename);
                    if (typeof resource.callback !== undefined) {
                        meshTask.onSuccess = resource.callback;
                    }
                    break;

                // Text File
                case 'text':
                    var textFileTask = assetsManager.addTextFileTask("task" + i, gosuArena.url.createAbsolute(resource.url));
                    if (typeof resource.callback !== undefined) {
                        textFileTask.onSuccess = resource.callback;
                    }
                    break;

                default:
                    console.log('Preloading resource failed: Unknown type');
                    break;
            }

        }

        assetsManager.onFinish = function () {
            onFinish(arenaState);
        }

        assetsManager.load();

    }

    function onSuccess(task, resource) {
        if (typeof resource.callback !== undefined) {
            resource.callback(task);
        }
    }

    return {
        load: load
    }
};
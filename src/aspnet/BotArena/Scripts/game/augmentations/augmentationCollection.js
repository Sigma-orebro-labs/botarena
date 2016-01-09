var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

gosuArena.factories.augmentations.createAugmentationCollection = function (augmentationDescriptors, botProperties, exposedMethods) {

    var augmentationCollection = {};

    for (var i = 0; i < augmentationDescriptors.length; i++) {
        var augmentation = augmentationDescriptors[i].create(botProperties, exposedMethods);

        augmentation.id = augmentationDescriptors[i].id;
        augmentation.name = augmentationDescriptors[i].name;
        augmentation.description = augmentationDescriptors[i].description;

        augmentationCollection[augmentationDescriptors[i].id] = augmentation;
    }

    return augmentationCollection;
};
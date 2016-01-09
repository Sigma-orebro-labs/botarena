var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

gosuArena.factories.augmentations.createAugmentationCollection = function (augmentationDescriptors, botProperties) {

    var augmentationCollection = {};

    for (var i = 0; i < augmentationDescriptors.length; i++) {
        var augmentation = augmentationDescriptors[i].create(botProperties);
        augmentationCollection[augmentationDescriptors[i].id] = augmentation;
    }

    return augmentationCollection;
};

        actionQueue.clear();

        if (status.canFire()) {
            actionQueue.fire();
        }

        actionQueue.turn(1);
        actionQueue.forward(2);
    },
    onHitByBullet: function (actionQueue, status, augmentations, eventArgs) {

        if (!augmentations.cloak.isActive() && augmentations.cloak.roundsRemaining() > 0) {
            augmentations.cloak.activate();
        }

        actionQueue.clear();

        if (status.canMoveLeft()) {
            actionQueue.left(10);            
        } else {
            actionQueue.right(10);
        }

        var degreesToTurn = eventArgs.angle - status.angle;

        actionQueue.turn(degreesToTurn);
    },
    options: {
        augmentations: ["cloak"]
    }
});

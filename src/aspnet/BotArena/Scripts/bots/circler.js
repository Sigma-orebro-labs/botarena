
function moveTowardsCenter(actionQueue, status) {
    if (status.position.x < gosuArena.arenaWidth * 0.25) {
        actionQueue.east(10);
    } else if (status.position.x > gosuArena.arenaWidth * 0.75) {
        actionQueue.west(10);
    }

    if (status.position.y < gosuArena.arenaHeight * 0.25) {
        actionQueue.south(10);
    } else if (status.position.y > gosuArena.arenaHeight * 0.75) {
        actionQueue.north(10);
    }
}

gosuArena.register({
    tick: function (actionQueue, status, augmentations) {

        function tryFire() {
            if (status.canFire()) {
                actionQueue.fire();
            }
        }

        if (status.seenEnemies.length > 0) {
            actionQueue.clear();
            
            var other = status.seenEnemies[0];

            tryFire();

            if (other.direction.x > 0) {
                actionQueue.east();
            } else if (other.direction.x < 0) {
                actionQueue.west();
            }
            
            if (other.direction.y > 0) {
                actionQueue.south();
            } else if (other.direction.y < 0) {
                actionQueue.north();
            }

            return;
        }

        if (!status.canMoveForward() || !status.canTurnRight()) {
            actionQueue.clear();
            moveTowardsCenter(actionQueue, status);
            return;
        }
        
        tryFire();
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
    }
});

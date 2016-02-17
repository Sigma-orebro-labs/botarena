        if (status.angle < 88) {
            actionQueue.turn(2);
            return;
        } if (status.angle > 92) {
            actionQueue.turn(-2);
            return;
        }
     
        if (status.position.x < status.arena.width - status.position.height - 10) {
            actionQueue.east(2);
            return;
        }
     
        // Moving south and starting to get close to the bottom wall?
        if (status.previousRoundDirection.y >= 0 && status.position.y > status.arena.height - status.position.width - 10) {
            // then start moving north instead
            actionQueue.north(2);
            return;
        } else if (status.previousRoundDirection.y <= 0 && status.position.y < 10) { // Moving north and getting close to north wall?
            actionQueue.south(2);
            return;
        }
     
        // Continue in the current direction. Use a positive direction if
        // the direction currently has no y component (i.e. moving east-west etc)
        if (status.previousRoundDirection.y < 0) {
            actionQueue.north(2);
        } else {
            actionQueue.south(2);
        }
        if (status.canFire()) {
            actionQueue.fire();
        }

        actionQueue.turn(1);
        actionQueue.forward(2);
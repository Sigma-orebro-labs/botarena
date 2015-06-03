    gosuArena.register({
        tick: function (actionQueue, status) {
    
            // Here is where your code goes...

            // For example, here is a super simple bot which just stands in the same spot, turns
            // and shoots
            actionQueue.fire();
            actionQueue.turn(1);
        }
    });

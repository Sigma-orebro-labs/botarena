    {
        // The following methods adds movement actions to the queue.
        // The units argument specifies the number of units to move in
        // the given direction.
        // Depending on the number of units specified the bot might
        // need several rounds to complete the action.
        north:   function (units) { ... },
        south:   function (units) { ... },
        west:    function (units) { ... },
        east:    function (units) { ... },
        forward: function (units) { ... },
        back:    function (units) { ... },
        left:    function (units) { ... },
        right:   function (units) { ... },

        // Turns the given number of degrees.
        // Depending on the number of degrees specified the bot might
        // need several rounds to complete the action.        
        // Degrees can be positive or negative.
        turn: function (degrees) { ... },

        // Fires a bullet, if the gun is ready to fire
        fire: function () { ... },  
        clear: function () { ... }, // Removes all actions added to the queue but that have not yet been executed
        isEmpty: function () { ... },
        length: function () { ... } // Returns the number of queued actions
    };

{
    position: {
        x,
        y,
        width,
        height,

        // The following properties are true if the bot is within 1 unit from
        // the corresponding wall
        isAtSouthWall,
        isAtNorthWall,
        isAtWestWall,
        isAtEastWall
    },
    arena: {
        width, // The width of the playing field
        height // The height of the playing field
    }
    angle, // The angle of your bot. A value between 0 and 360 degrees where 0 degrees is south.
    roundsUntilWeaponIsReady,
    canFire,  // True if the weapon is ready for firing, false if the weapon is still cooling down
    seenBots, // An array of objects representing the bots your bots currently can see

    // The following properties are true if the bot is able to perform the
    // corresponding movement action. If they are false that means that the bot
    // is blocked by something, such as another bot or a wall.
    canMoveForward,
    canMoveBack,
    canMoveNorth,
    canMoveSouth,
    canMoveEast,
    canMoveWest,

    // Note that since the bot is rectangular and turns around its own center
    // it is unable to turn if it is very close to any of the walls.
    // You need to get a few units of space around the bot to ensure that is
    // can turn without colliding with anything
    canTurnLeft,
    canTurnRight,
}

/****** Object:  Table [dbo].[ELMAH_Error]    Script Date: 02/02/2014 12:19:05 ******/

CREATE TABLE [dbo].[ELMAH_Error](
	[ErrorId] [uniqueidentifier] NOT NULL,
	[Application] [nvarchar](60) NOT NULL,
	[Host] [nvarchar](50) NOT NULL,
	[Type] [nvarchar](100) NOT NULL,
	[Source] [nvarchar](60) NOT NULL,
	[Message] [nvarchar](500) NOT NULL,
	[User] [nvarchar](50) NOT NULL,
	[StatusCode] [int] NOT NULL,
	[TimeUtc] [datetime] NOT NULL,
	[Sequence] [int] IDENTITY(1,1) NOT NULL,
	[AllXml] [ntext] NOT NULL,
 CONSTRAINT [PK_ELMAH_Error] PRIMARY KEY NONCLUSTERED 
(
	[ErrorId] ASC
))
--SET IDENTITY_INSERT [dbo].[ELMAH_Error] OFF

/****** Object:  Table [dbo].[Users]    Script Date: 02/02/2014 12:19:05 ******/



CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](255) NOT NULL,
	[Email] [nvarchar](1024) NULL,
	[HashedPassword] [nvarchar](255) NOT NULL,
	[LastLoginDate] [datetime] NULL,
	[JoinDate] [datetime] NOT NULL,
	[IsApiAccessAllowed] [bit] NOT NULL,
	[ApiKey] [nvarchar](255) NULL,
	[ApiRequestCount] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
),
 CONSTRAINT [UQ_Users_Username] UNIQUE NONCLUSTERED 
(
	[Username] ASC
)
) ON [PRIMARY])
GO
SET IDENTITY_INSERT [dbo].[Users] ON
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (6, N'erikojebo', N'73-DA-E9-8A-FE-7F-02-9B-07-EB-2D-D3-25-DD-84-3B', NULL, CAST(0x0000A2A3015D1631 AS DateTime), 1, N'eee0aee4-5ef3-42ef-82fe-b0f5563709dc', 6)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (7, N'GosuArenaTrainer', N'5F-4D-CC-3B-5A-A7-65-D6-1D-83-27-DE-B8-82-CF-99', NULL, CAST(0x0000A2A5000250F5 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (8, N'joakimthun', N'E8-44-F7-BB-BF-BB-4E-38-5D-8C-39-4F-DA-4C-56-13', NULL, CAST(0x0000A2AC0084AFDD AS DateTime), 1, N'752273ad-a904-4015-8f11-f59df068a17f', 80)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (9, N'Angel_of_mercy', N'2B-D3-BE-91-0C-D6-AC-27-15-A6-08-79-9E-61-1C-A9', NULL, CAST(0x0000A2B200F72CFD AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (10, N'David', N'9C-16-B3-8B-3F-A9-92-59-62-29-31-27-EA-C9-B5-D4', NULL, CAST(0x0000A2B400C5BBC8 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (11, N'Kargnus', N'AB-17-E8-95-9B-97-2D-D4-0B-7E-96-89-FA-45-44-C1', NULL, CAST(0x0000A2B400C921D8 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (12, N'anton', N'EE-85-52-8C-72-8D-CC-9B-21-36-81-C3-E5-9A-E7-C9', NULL, CAST(0x0000A2B400C9440F AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (13, N'Jones', N'23-8C-6A-68-B2-7B-4B-25-F4-3E-4D-94-47-E8-CE-13', NULL, CAST(0x0000A2B400CBA5DA AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (14, N'Tommy', N'53-B4-88-8F-77-AE-20-14-86-E1-35-10-64-1C-B1-1C', NULL, CAST(0x0000A2B400CD6DE2 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (15, N'Eiidish', N'A4-7C-8B-F2-9E-A4-1C-90-BA-5C-43-F6-19-24-5F-68', NULL, CAST(0x0000A2B400CDCE11 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (16, N'miry', N'A4-0C-B0-CC-39-6D-A4-6E-5E-7D-D4-09-08-E1-4C-40', NULL, CAST(0x0000A2B400CE0A68 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (17, N'jonasmalm', N'23-8C-6A-68-B2-7B-4B-25-F4-3E-4D-94-47-E8-CE-13', NULL, CAST(0x0000A2B400CE153A AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (18, N'Svensk Freds', N'6D-7E-B9-DF-9D-DD-DC-57-A3-EB-2F-75-4F-FD-B7-AE', NULL, CAST(0x0000A2B400D1A539 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (19, N'Buffalo_Bill', N'68-CD-3D-0D-41-DD-4D-03-54-8D-0A-54-C5-A8-3F-A3', NULL, CAST(0x0000A2B400D25EB9 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (20, N'brolin', N'4C-1A-7F-AA-8A-53-0C-8F-5B-52-62-2F-AD-67-8B-6B', NULL, CAST(0x0000A2B400D30123 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (21, N'00xB', N'5C-9B-9F-15-F0-EC-88-B3-4D-85-14-05-F9-8C-87-0C', NULL, CAST(0x0000A2B400EC23A1 AS DateTime), 0, NULL, 0)
INSERT [dbo].[Users] ([Id], [Username], [HashedPassword], [LastLoginDate], [JoinDate], [IsApiAccessAllowed], [ApiKey], [ApiRequestCount]) VALUES (22, N'tb', N'A4-92-70-AF-45-D9-C9-22-C8-53-1F-68-CF-29-BD-88', NULL, CAST(0x0000A2C100B7FE8B AS DateTime), 0, NULL, 0)
SET IDENTITY_INSERT [dbo].[Users] OFF
/****** Object:  StoredProcedure [dbo].[ELMAH_LogError]    Script Date: 02/02/2014 12:19:02 ******/

CREATE PROCEDURE [dbo].[ELMAH_LogError]
(
    @ErrorId UNIQUEIDENTIFIER,
    @Application NVARCHAR(60),
    @Host NVARCHAR(30),
    @Type NVARCHAR(100),
    @Source NVARCHAR(60),
    @Message NVARCHAR(500),
    @User NVARCHAR(50),
    @AllXml NTEXT,
    @StatusCode INT,
    @TimeUtc DATETIME
)
AS

    SET NOCOUNT ON

    INSERT
    INTO
        [ELMAH_Error]
        (
            [ErrorId],
            [Application],
            [Host],
            [Type],
            [Source],
            [Message],
            [User],
            [AllXml],
            [StatusCode],
            [TimeUtc]
        )
    VALUES
        (
            @ErrorId,
            @Application,
            @Host,
            @Type,
            @Source,
            @Message,
            @User,
            @AllXml,
            @StatusCode,
            @TimeUtc
        )
GO
/****** Object:  StoredProcedure [dbo].[ELMAH_GetErrorXml]    Script Date: 02/02/2014 12:19:02 ******/

CREATE PROCEDURE [dbo].[ELMAH_GetErrorXml]
(
    @Application NVARCHAR(60),
    @ErrorId UNIQUEIDENTIFIER
)
AS

    SET NOCOUNT ON

    SELECT 
        [AllXml]
    FROM 
        [ELMAH_Error]
    WHERE
        [ErrorId] = @ErrorId
    AND
        [Application] = @Application
GO
/****** Object:  StoredProcedure [dbo].[ELMAH_GetErrorsXml]    Script Date: 02/02/2014 12:19:02 ******/

CREATE PROCEDURE [dbo].[ELMAH_GetErrorsXml]
(
    @Application NVARCHAR(60),
    @PageIndex INT = 0,
    @PageSize INT = 15,
    @TotalCount INT OUTPUT
)
AS 

    SET NOCOUNT ON

    DECLARE @FirstTimeUTC DATETIME
    DECLARE @FirstSequence INT
    DECLARE @StartRow INT
    DECLARE @StartRowIndex INT

    SELECT 
        @TotalCount = COUNT(1) 
    FROM 
        [ELMAH_Error]
    WHERE 
        [Application] = @Application

    -- Get the ID of the first error for the requested page

    SET @StartRowIndex = @PageIndex * @PageSize + 1

    IF @StartRowIndex <= @TotalCount
    BEGIN

        SET ROWCOUNT @StartRowIndex

        SELECT  
            @FirstTimeUTC = [TimeUtc],
            @FirstSequence = [Sequence]
        FROM 
            [ELMAH_Error]
        WHERE   
            [Application] = @Application
        ORDER BY 
            [TimeUtc] DESC, 
            [Sequence] DESC

    END
    ELSE
    BEGIN

        SET @PageSize = 0

    END

    -- Now set the row count to the requested page size and get
    -- all records below it for the pertaining application.

    SET ROWCOUNT @PageSize

    SELECT 
        errorId     = [ErrorId], 
        application = [Application],
        host        = [Host], 
        type        = [Type],
        source      = [Source],
        message     = [Message],
        [user]      = [User],
        statusCode  = [StatusCode], 
        time        = CONVERT(VARCHAR(50), [TimeUtc], 126) + 'Z'
    FROM 
        [ELMAH_Error] error
    WHERE
        [Application] = @Application
    AND
        [TimeUtc] <= @FirstTimeUTC
    AND 
        [Sequence] <= @FirstSequence
    ORDER BY
        [TimeUtc] DESC, 
        [Sequence] DESC
    FOR
        XML AUTO
GO
/****** Object:  Table [dbo].[Bots]    Script Date: 02/02/2014 12:19:05 ******/

CREATE TABLE [dbo].[Bots](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Script] [nvarchar](max) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[IsTrainer] [bit] NOT NULL,
	[IsDemoBot] [bit] NOT NULL,
	[IsPublic] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
),
 CONSTRAINT [UQ_Bots_Name] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Bots] ON
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (4, 7, N'bot2', N'var xDirection = 1;

gosuArena.register({
    tick: function (actionQueue, status) {
        if (status.position.x > gosuArena.arenaWidth / 2.0) {
            xDirection = -1;
        } else if (status.position.x < gosuArena.arenaWidth / 4.0) {
            xDirection = 1;
        }

        if (status.position.isAtWestWall || status.position.isAtEastWall) {
            actionQueue.clear();
        }

        if (xDirection == 1) {
            actionQueue.east(10);
            actionQueue.north(1);
        } else {
            actionQueue.west(10);
            actionQueue.south(1);
        }
    },
    options: {
        color: "#aa0",
        startPosition: {
            x: gosuArena.arenaWidth / 3,
            y: gosuArena.arenaHeight / 3
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 1, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (5, 7, N'bot3', N'gosuArena.register({
    tick: function (actionQueue, status) {

        if (status.position.isAtSouthWall) {
            actionQueue.clear();
            actionQueue.north(50);
        } else {
            actionQueue.south();
        }

        if (status.position.isAtEastWall) {
            actionQueue.clear();
            actionQueue.west(30);
        } else {
            actionQueue.east();
        }
    },
    options: {
        color: "#0a0",
        startPosition: {
            x: gosuArena.arenaWidth / 3,
            y: gosuArena.arenaHeight / 4
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 1, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (6, 7, N'bot4', N'var xDirection = 1;

gosuArena.register({
    tick: function (actionQueue, status) {
        if (xDirection == 1) {
            actionQueue.east(2);
        } else {
            actionQueue.west(2);
        }
    },
    onCollision: function (actionQueue, status) {
        actionQueue.clear();
        xDirection *= -1;
    },
    options: {
        color: "#a00",
        startPosition: {
            x: gosuArena.arenaWidth / 2,
            y: gosuArena.arenaHeight / 3
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 1, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (7, 7, N'circler', N'
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
    tick: function (actionQueue, status) {

        function tryFire() {
            if (status.canFire()) {
                actionQueue.fire();
            }
        }

        if (status.seenBots.length > 0) {
            actionQueue.clear();
            
            var other = status.seenBots[0];
            
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
    onHitByBullet: function (actionQueue, status, eventArgs) {
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
', CAST(0x0000A2A500026624 AS DateTime), 1, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (8, 7, N'cornerCollider', N'gosuArena.register({
    tick: function (actionQueue, status) {
        if (status.angle < 45) {
            actionQueue.turn(2);
        } else {
            actionQueue.north();
        }
    },
    options: {
        color: "navy",
        startPosition: {
            x: 300,
            y: 300
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 1, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (9, 7, N'cornerCollider2', N'gosuArena.register({
    tick: function (actionQueue, status) {
        if (status.angle < 45) {
            actionQueue.turn(2);
        } else
        {
            actionQueue.south();
        }
    },
    options: {
        color: "navy",
        startPosition: {
            x: 305,
            y: 270
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 1, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (10, 7, N'eastbot', N'gosuArena.register({
    tick: function (actionQueue, status) {
        actionQueue.east(20);
    },
    options: {
        color: "#a0a",
        startPosition: {
            x: gosuArena.arenaWidth - 100,
            y: gosuArena.arenaHeight / 5
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 1, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (11, 7, N'northbot', N'gosuArena.register({
    tick: function (actionQueue, status) {

        if (status.angle < 15) {
            actionQueue.turn(2);
        }

        actionQueue.north(20);
    },
    options: {
        color: "#70f",
        startPosition: {
            x: 100,
            y: 100
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 1, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (12, 7, N'southbot', N'gosuArena.register({
    tick: function (actionQueue, status) {
        actionQueue.south(20);
    },
    options: {
        color: "#a0a",
        startPosition: {
            x: gosuArena.arenaWidth / 5,
            y: gosuArena.arenaHeight - 100
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 1, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (13, 7, N'turnbot', N'gosuArena.register({
    tick: function (actionQueue, status) {

        var seenEnemies = status.seenBots.filter(function(bot) {
            return !bot.teamId || bot.teamId != status.teamId;
        });

        if (seenEnemies.length && seenEnemies.length == status.seenBots.length) {
            actionQueue.clear();
            
            if (status.roundsUntilWeaponIsReady <= 0) {
                actionQueue.fire();
            }
        } else {
            actionQueue.turn(status.actionsPerRound);
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (14, 7, N'westbot', N'gosuArena.register({
    tick: function (actionQueue, status) {

        if (Math.abs(status.angle - 270) >= 1.5) {
            actionQueue.turn(-2);
        } else {
            actionQueue.west(20);
        }
    },
    options: {
        color: "#a0a",
        startPosition: {
            x: 90,
            y: 110
        }
    }
});
', CAST(0x0000A2A500026624 AS DateTime), 1, 1, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (15, 6, N'cottage-cheese-2.0.0', N'var sawBotLastRound = false;
var turnIncrement = 2;
var lastSpottedEnemyDirection = null;
var lastSpottedEnemyLocation = null;
var roundsSinceLastSpottedEnemy = null;
var panicRoundsLeft = 0;
// * Turn around until something is spotted
// * Try to track the opponent
// * Move orthogonally to the incoming bullet when hit, away from the edges


var yAxisVector = gosu.math.createVector(0, 1);

function tryFire(actionQueue, status) {
  if (status.canFire) {
    
    if (panicRoundsLeft <= 0) {
       actionQueue.clear();
    }
    
    actionQueue.fire();
  }
}

function saveEnemyInfo(status) {
  lastSpottedEnemyDirection = status.seenBots[0].direction;
  lastSpottedEnemyLocation = status.seenBots[0].position;
}

function lastSpottedEnemyVector() {
  return gosu.math.createVector(
                lastSpottedEnemyLocation.x,
                lastSpottedEnemyLocation.y);
}



gosuArena.register({
    tick: function (actionQueue, status) {
 
      if (panicRoundsLeft > 0) {
        panicRoundsLeft--;
      }
      
      if (roundsSinceLastSpottedEnemy !== null) {
        roundsSinceLastSpottedEnemy++;
      }
      
        var canSeeBotsThisRound = status.seenBots.length > 0;

      if (status.position.x > status.arena.width / 5 && status.canMoveWest()) {
        actionQueue.clear();
        actionQueue.west(2);
        return;
      }
      
        if (canSeeBotsThisRound) {
            tryFire(actionQueue, status);
            saveEnemyInfo(status);
            sawBotLastRound = true;
            roundsSinceLastSpottedEnemy = 0;
        } else {

          // If we just lost sight of a bot, change the rotation direction
          if (sawBotLastRound) {
          
            if (lastSpottedEnemyDirection && lastSpottedEnemyLocation)  {
          
              var calculatedEnemyVector = lastSpottedEnemyVector().add(lastSpottedEnemyDirection);
          
              var enemyDeltaAngle = lastSpottedEnemyVector().signedAngleTo(calculatedEnemyVector);
            
            
              // Get sign of angle delta
              turnIncrement = enemyDeltaAngle / Math.abs(enemyDeltaAngle);
          
            }
          } else {
            
            if (lastSpottedEnemyDirection && lastSpottedEnemyLocation)  {
          
              var angleToLastKnownEnemyLocation =
                yAxisVector.signedAngleTo(
                  lastSpottedEnemyVector().subtract(status.position));
            
              var adjustedAngleToLastKnownEnemyLocation =
                  (angleToLastKnownEnemyLocation + 360) % 360;
              
              var angleDiff = Math.abs(
                adjustedAngleToLastKnownEnemyLocation - status.angle);
              
              if (angleDiff > roundsSinceLastSpottedEnemy + 10) {
                turnIncrement *= -1;
              }
            }
          }
          
          actionQueue.turn(turnIncrement);
          sawBotLastRound = false; 
        
        }
    },
  onHitByBullet: function (actionQueue, status, args) {
    
    if (status.seenBots.length > 0 && status.seenBots[0].health > status.health) {
      tryFire(actionQueue, status);
      actionQueue.clear();
      panicRoundsLeft = 20;
    }
    
    if (45 < args.angle && args.angle < 135 ||
        225 < args.angle && args.angle < 315) {
      if (status.position.x > 100) {
        actionQueue.west(50);
      } else {
        actionQueue.east(50);
      }
    } else {
      if (status.position.y > 100) {
        actionQueue.north(50);
      } else {
        actionQueue.south(50);
      }
    }
  },
  options: {
    startPosition: {
      x: 100,
      y: 100,
      angle: 45
    }
  }
});
', CAST(0x0000A2A600A6AD67 AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (16, 7, N'randomizer', N'gosuArena.register({
    tick: function(actionQueue) {
        var random = Math.random();

        if (actionQueue.length() > 2) {
            return;
        }

        actionQueue.fire();

        if (random < 0.2) {
            actionQueue.north(100);
        } else if (random < 0.4) {
            actionQueue.south(100);
        } else if (random < 0.6) {
            actionQueue.west(100);
        } else if (random < 0.8) {
            actionQueue.east(100);
        } else {
            actionQueue.turn(Math.random() * 90);
        }
    }
});
', CAST(0x0000A2A601778F44 AS DateTime), 1, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (18, 6, N'defaulter', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2A7000EF8DC AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (20, 8, N'bot', N'bsfhuhdfdjfghdfgdf', CAST(0x0000A2AC0084CCF6 AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (21, 9, N'Avenging angel', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(math.random());
        actionQueue.forward(math.random());
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400C432C1 AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (22, 10, N'Davids bot', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        actionQueue.clear();
          actionQueue.forward(1);
       
       
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400C8EBC8 AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (23, 11, N'SluggBot', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots
var Life = 100;

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
      if (!status.canMoveForward()){
          actionQueue.turn(30);
      }
      
      if(Life < 80){
        actionQueue.turn(10);
        actionQueue.back(30);
      }
        actionQueue.turn(2);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        Life -= 10;
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#28758d"
    }
});
', CAST(0x0000A2B400C9552D AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (24, 6, N'testbot', N'gosuArena.register({
   tick: function (actionQueue, status) {

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(100);
        actionQueue.forward(100);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        // Update!
    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400C9D53B AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (25, 12, N'ToonRaver', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
      
      
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        // This will be called if your bot is hit by a bullet from another bot
    },
    options: {
        color: "#FFFFFF"
    }
});
', CAST(0x0000A2B400C9F58F AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (26, 12, N'Romper Stomper', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400CB28B0 AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (27, 13, N'trialAndTerror.v2', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400CC169A AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (28, 13, N'trialAndTerrorv2', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400CC52C1 AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (29, 14, N'Calculon', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        while (status.seenBots.length > 0 && status.canFire()) {
          actionQueue.clear();
          actionQueue.fire();
          
        }
        
      actionQueue.turn(1);
      actionQueue.forward(1);
        
    },
  
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
  
    onCollision: function (actionQueue, status) {
      actionQueue.clear();
      actionQueue.back(1);
      actionQueue.turn(45);
      actionQueue.forward(1);
    },
  
    options: {
        color: "#FF0000"
    }
});
', CAST(0x0000A2B400CDBF0A AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (30, 15, N'Messersmidth 2.0', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot
      actionQueue.back(10);
      actionQueue.turn(20);
    },
    options: {
        color: "#000000"
    }
});
', CAST(0x0000A2B400CE1D01 AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (31, 17, N'trialAndTerror', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(2);
        actionQueue.forward(10);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400CE3819 AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (32, 16, N'botski', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        else
        {
           actionQueue.turn(1);
           actionQueue.forward(1);  
        }
      
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
  onCollision: function (actionQueue, status) {
      
  },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400CE745D AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (33, 19, N'hoppalong cassidy', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots
state=1;
ishit=0;
gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example: status.seenBots.length > 0 && 

      //  if (status.canFire()) {
      //      actionQueue.clear();
      //      actionQueue.fire();
       
      switch(state) {
        case 1: //sök
          actionQueue.turn(-2);
          console.log(''state=1 '', status.angle, status.canFire());
          if (status.seenBots.length > 0) {
            state=2;
          }
          if (ishit==1) {
            state=3;
          }

          break;
        case 2: //skjut
          if (status.seenBots.length <= 0) {
            state=1;
          }
          if (ishit==1) {
            state=3;
          }
          actionQueue.clear();
          actionQueue.fire();
          break;
        case 3: //fly
          actionQueue.clear();
          actionQueue.left(20);
          ishit = 0;
          state = 1;
          break;
        default:
          break;
      }

    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot
      ishit=1;
    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400D29915 AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (34, 20, N'brolin', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

var turnVar = 0;

gosuArena.register(
{
    tick: function(actionQueue, status)
    {

        // Do something interesting here... for example:

        if(status.seenBots.length > 0 && status.canFire())
        {
            actionQueue.clear();
            actionQueue.fire();
        }
      
      actionQueue.turn(1);
    },
    onHitByBullet: function(actionQueue, status, eventArgs)
    {
        
        // This will be called if your bot is hit by a bullet from another bot
        var turnRandom = Math.floor((Math.random()*2)+1);
            var dirRandom = Math.floor((Math.random()*4)+1);
      
        
        
      
        if(turnRandom == 1)
          actionQueue.turn(Math.floor((Math.random()*70)+1));
        else
          actionQueue.turn(Math.floor((Math.random()*(-70))-1));
      
          if(dirRandom == 1)
              actionQueue.forward(Math.floor((Math.random()*50)+1));
          else if(dirRandom == 2)
              actionQueue.back(Math.floor((Math.random()*50)+1));
          else if(dirRandom == 3)
              actionQueue.left(Math.floor((Math.random()*50)+1));
          else if(dirRandom == 4)
              actionQueue.right(Math.floor((Math.random()*50)+1));
    },
    options:
    {
        color: "#71d40e"
    }
});

console.log(gosuArena);', CAST(0x0000A2B400D32445 AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (35, 16, N'pwnbot', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2B400D8558F AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (36, 20, N'b0dy', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

var turnVar = 1;
var strafeVar = 1;
var healthBefore = 100;

gosuArena.register(
{
    tick: function(actionQueue, status)
    {
        

        if(status.seenBots.length > 0 && status.canFire() && healthBefore == status.health)
        {
            actionQueue.clear();
            actionQueue.fire();
        }
        else if(status.seenBots.length > 0 && healthBefore == status.health)
        {
        }
        else
        {
          //console.log(status.angle);
         actionQueue.turn(1);
        //console.log(Math.round(status.position.x));
        }
      
          //console.log(healthBefore, status.health);
          healthBefore = status.health;
    },
    onHitByBullet: function(actionQueue, status, eventArgs)
    {
        
        // This will be called if your bot is hit by a bullet from another bot
      
       if(status.angle == 90)
            turnVar = -1;
          else if(status.angle == 270)
            turnVar = 1;
          actionQueue.turn(turnVar);
          
          
          if(status.position.y > 10)
            actionQueue.north(10);
          else
          {
            if(strafeVar == -1)
            {
              if(Math.round(status.position.x) == 700)
                strafeVar = 1;
              actionQueue.east(1);
            }
            else if(strafeVar == 1)
            {
              if(Math.round(status.position.x) == 10)
                strafeVar = -1;
              actionQueue.west(1);
            }
            //console.log(strafeVar);
          }

    },
    options:
    {
        color: "#71d40e"
    }
});



console.log(gosuArena);', CAST(0x0000A2B500F2245D AS DateTime), 0, 0, 0)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (37, 8, N'apiTester', N'//@ApiKey:752273ad-a904-4015-8f11-f59df068a17f,Bot:37@

// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots
gosuArena.register({
    tick: function (actionQueue, status) {

        // From LazyBot :)

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }

        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {

        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2BB01508932 AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (38, 7, N'waller', N'var wall = "north";

gosuArena.register({
    tick: function(actionQueue, status) {

        function tryFire() {
            if (status.canFire()) {
                actionQueue.fire();
            }
        }

        if (status.seenBots.length > 0) {
            actionQueue.clear();
            actionQueue.fire();
        }

        var tolerance = 20;

        if (wall == "north") {

            if (status.angle > 3) {
                actionQueue.clear();
                actionQueue.turn(2);
            } else if (status.arena.width - status.position.x - status.position.width < tolerance) {
                wall = "east";
                actionQueue.south(2);
            } else {
                actionQueue.east(2);
            }

        } else if (wall == "east") {

            if (status.angle > 93) {
                actionQueue.clear();
                actionQueue.turn(-2);
            } else if (status.angle < 87) {
                actionQueue.clear();
                actionQueue.turn(2);
            } else if (status.arena.height - status.position.y - status.position.height < tolerance) {
                wall = "south";
                actionQueue.west(2);
            } else {
                actionQueue.south(2);
            }

        } else if (wall == "south") {

            if (status.angle > 183) {
                actionQueue.clear();
                actionQueue.turn(-2);
            } else if (status.angle < 177) {
                actionQueue.clear();
                actionQueue.turn(2);
            } else if (status.position.x < tolerance) {
                wall = "west";
                actionQueue.north(2);
            } else {
                actionQueue.west(2);
            }

        } else if (wall == "west") {

            if (status.angle > 273) {
                actionQueue.clear();
                actionQueue.turn(-2);
            } else if (status.angle < 267) {
                actionQueue.clear();
                actionQueue.turn(2);
            } else if (status.position.y < tolerance) {
                wall = "north";
                actionQueue.east(2);
            } else {
                actionQueue.north(2);
            }
        }

        tryFire();
    },
    options: {
        color: "#f4f"
    }
});', CAST(0x0000A2BB0164DA80 AS DateTime), 1, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (39, 8, N'IRStupid', N'//@ApiKey:752273ad-a904-4015-8f11-f59df068a17f,Bot:39@

var globals = globals || {};
globals.attack = false;
globals.stillInSightCounter = 0;
globals.back = true;
globals.lastKnownEnemyDirection = null;
globals.lastKnownEnemyPosition = null;
globals.turnDirection = -1;

gosuArena.register({
    tick: function (actionQueue, status) {

        if (globals.stillInSightCounter === 100) {
            if (status.seenBots.length > 0) {
                globals.attack = true;
                getLastKnownEnemyDirectionAndPosition();
                globals.turnDirection = getTurnDirection();
            }
            else {
                globals.attack = false;
            }

            globals.stillInSightCounter = 0;
        }

        if (status.seenBots.length > 0) {
            globals.attack = true;
            getLastKnownEnemyDirectionAndPosition();
            globals.turnDirection = getTurnDirection();
        }

        if (globals.attack) {
            actionQueue.clear();
            actionQueue.fire();
            actionQueue.forward(30);
        }
        else {
            actionQueue.turn(globals.turnDirection);
        }

        globals.stillInSightCounter++;

        function getLastKnownEnemyDirectionAndPosition() {
            globals.lastKnownEnemyDirection = status.seenBots[0].direction;
            globals.lastKnownEnemyPosition = status.seenBots[0].position;
        }

        function getTurnDirection() {
            if (globals.lastKnownEnemyPosition !== null) {
                var meV = gosu.math.createVector(status.position.x, status.position.y);
                var enemyV = gosu.math.createVector(status.position.x, status.position.y);
                var angleToEnemy = meV.angleTo(enemyV) % 360;
                if (isNaN(angleToEnemy)) {
                    return 1;
                } else {
                    return angleToEnemy;
                }
            }

            return 1;
        }

        
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        actionQueue.clear();
        actionQueue.turn(20);
        actionQueue.back(20);
    },
    onCollision: function (actionQueue, status) {
        var wallCollision =
        status.position.isAtSouthWall ||
        status.position.isAtNorthWall ||
        status.position.isAtWestWall ||
        status.position.isAtEastWall;

        if (wallCollision) {
            globals.attack = false;
            actionQueue.turn(90);
        } else {
            if (globals.back) {
                actionQueue.back(1);
                globals.back = !globals.back;
            }
            else {
                actionQueue.forward(1);
                globals.back = !globals.back;
            }
        }
    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2C1005AD9F9 AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (40, 14, N'BigBang', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
', CAST(0x0000A2C100B714EB AS DateTime), 0, 0, 1)
INSERT [dbo].[Bots] ([Id], [UserId], [Name], [Script], [CreatedDate], [IsTrainer], [IsDemoBot], [IsPublic]) VALUES (41, 22, N'Kabooom', N'// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenBots.length > 0 ) {
            //actionQueue.forward(0);
            actionQueue.clear();
            actionQueue.fire();
            //actionQueue.forward(1);
        }
        else{
          actionQueue.turn(1);
          actionQueue.forward(2);
        }
        
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
  
    onCollision: function (actionQueue, status) {
            // This will be called when your bot collides with something else
            actionQueue.clear();
            actionQueue.back(1);
            actionQueue.turn(1);
    },
    options: {
        color: "#FF0000"
    }
});
', CAST(0x0000A2C100B825D8 AS DateTime), 0, 0, 1)
SET IDENTITY_INSERT [dbo].[Bots] OFF
/****** Object:  Default [DF_ELMAH_Error_ErrorId]    Script Date: 02/02/2014 12:19:05 ******/
ALTER TABLE [dbo].[ELMAH_Error] ADD  CONSTRAINT [DF_ELMAH_Error_ErrorId]  DEFAULT (newid()) FOR [ErrorId]
GO
/****** Object:  Default [DF__Users__IsApiAcce__1367E606]    Script Date: 02/02/2014 12:19:05 ******/
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [IsApiAccessAllowed]
GO
/****** Object:  Default [DF_ApiRequestCount]    Script Date: 02/02/2014 12:19:05 ******/
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_ApiRequestCount]  DEFAULT ((0)) FOR [ApiRequestCount]
GO
/****** Object:  ForeignKey [FK_Bots_Users]    Script Date: 02/02/2014 12:19:05 ******/
ALTER TABLE [dbo].[Bots]  WITH CHECK ADD  CONSTRAINT [FK_Bots_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Bots] CHECK CONSTRAINT [FK_Bots_Users]
GO

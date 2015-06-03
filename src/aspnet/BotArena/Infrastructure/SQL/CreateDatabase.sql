GO
CREATE USER [arenauser] FOR LOGIN [arenauser] WITH DEFAULT_SCHEMA=[dbo]
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[Username] [nvarchar](255) NOT NULL,
	[Email] [nvarchar](512) NULL,
	[HashedPassword] [nvarchar](255) NOT NULL,
	[JoinDate] [datetime] NOT NULL,
	[LastLoginDate] [datetime] NULL,
	[ApiKey] [nvarchar](255) NULL,
	[IsApiAccessAllowed] bit NOT NULL DEFAULT(0),
	[ApiRequestCount] int NOT NULL DEFAULT(0),
	CONSTRAINT UQ_Users_Username UNIQUE(Username))
GO

CREATE TABLE [dbo].[Bots](
	[Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[UserId] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Script] [nvarchar](MAX) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[IsTrainer] [bit] NOT NULL,
	[IsDemoBot] [bit] NOT NULL,
	[IsPublic] [bit] NOT NULL,
	CONSTRAINT UQ_Bots_Name UNIQUE(Name))
GO

ALTER TABLE [dbo].[Bots] ADD  CONSTRAINT [FK_Bots_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO


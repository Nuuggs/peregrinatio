const gameModel = (sequelize, DataTypes) => {
  return sequelize.define('games', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      gameState: {
        allowNull: false,
        type: DataTypes.JSON,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
  },
  {underscored: true,}
  );
}

module.exports = gameModel
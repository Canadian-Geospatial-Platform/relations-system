export default (sequelize, type, tableName, keyName1, keyName2) => {
  return sequelize.define(
    tableName,
    {
      Id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      PopularityIndex: {
        type: type.INTEGER,
        notNull: true,
        defaultValue: 0
      },
      [keyName1]: {
        type: type.INTEGER,
        allowNull: false,
        omitNull: true,
        unique: "parentChildIndex"
      },
      [keyName2]: {
        type: type.INTEGER,
        allowNull: false,
        omitNull: true,
        unique: "parentChildIndex"
      }
    },
    {
      uniqueKeys: {
        parentChildIndex: {
          fields: [keyName1, keyName2]
        }
      }
    }
  );
};

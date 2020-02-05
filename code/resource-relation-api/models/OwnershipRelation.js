export default (sequelize, type, tableName, keyName1, keyName2) => {
  return sequelize.define(
    tableName,
    {
      Id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      },
      OwnershipTypeId: {
        type: type.INTEGER,
        allowNull: false,
        omitNull: true
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

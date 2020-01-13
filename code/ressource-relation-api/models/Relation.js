"use strict";

module.exports = (sequelize, type, tableName, keyName1, keyName2) => {
  return sequelize.define(tableName, {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PopularityIndex: {
      type: type.INTEGER,
      defaultValue: 0
    },
    [keyName1]: {
      type: type.INTEGER,
      allowNull: false,
      omitNull: true
    },
    [keyName2]: {
      type: type.INTEGER,
      allowNull: false,
      omitNull: true
    }
  });
};

"use strict";

module.exports = (sequelize, type, tableName) => {
  return sequelize.define(tableName, {
    Id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PopularityIndex: {
      type: type.INTEGER,
      defaultValue: 0
    }
  });
};

"use strict";

module.exports = (sequelize, type, tableName) => {
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
        defaultValue: 0
      },
      ParentId: {
        type: type.INTEGER,
        onDelete: "cascade",
        allowNull: false,
        omitNull: true,
        unique: "parentChildIndex"
      },
      ChildId: {
        type: type.INTEGER,
        onDelete: "cascade",
        allowNull: false,
        omitNull: true,
        unique: "parentChildIndex"
      }
    },
    {
      uniqueKeys: {
        parentChildIndex: {
          fields: ["ParentId", "ChildId"]
        }
      }
    }
  );
};

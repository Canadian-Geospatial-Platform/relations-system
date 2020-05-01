export default (sequelize, type) => {
  return sequelize.define("Resource", {
    Id: {
      allowNull: false,
      type: type.STRING,
      primaryKey: true,
    },
    Title: type.STRING,
    Description: type.STRING,
    ResourceUrl: type.STRING,
    Theme: {
      type: type.STRING,
      validate: {
        // prettier-ignore
        isIn: {
          args: [['Administration', 'Economy', 'Emergency', 'Environment', 'Imagery', 'Infrastructure', 'Legal', 'Science', 'Society']],
          msg: 'Invalid Theme.'
      }
      },
    },
    PopularityIndex: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });
};

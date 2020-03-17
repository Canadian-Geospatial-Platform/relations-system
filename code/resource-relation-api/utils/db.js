import Sequelize from "sequelize";
import Gendoc from "apidoc-sequelize-generator";
import Mysql2 from "mysql2";

import CollectionModel from "../models/Collection";
import ResourceModel from "../models/Resource";
import TagModel from "../models/Tag";
import UserModel from "../models/User";
import CommunityModel from "../models/Community";
import ThemeModel from "../models/Theme";
import SearchRecordModel from "../models/SearchRecord";
import RelationModel from "../models/Relation";
import OwnershipRelationModel from "../models/OwnershipRelation";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    logging: false,
    dialect: "mysql",
    dialectModule: Mysql2,
    dialectOptions: {
      connectTimeout: 60000
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
);

const Collection = CollectionModel(sequelize, Sequelize);
const Resource = ResourceModel(sequelize, Sequelize);
const Tag = TagModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Community = CommunityModel(sequelize, Sequelize);
const Theme = ThemeModel(sequelize, Sequelize);
const SearchRecord = SearchRecordModel(sequelize, Sequelize);

Theme.belongsTo(Community, { onDelete: "cascade" });

const CommunityUserRelation = RelationModel(
  sequelize,
  Sequelize,
  "CommunityUserRelation",
  "CommunityId",
  "UserId"
);
Community.belongsToMany(User, {
  through: CommunityUserRelation
});
User.belongsToMany(Community, {
  through: CommunityUserRelation
});

const CollectionCollectionRelation = RelationModel(
  sequelize,
  Sequelize,
  "CollectionCollectionRelation",
  "ParentId",
  "ChildId"
);
Collection.belongsToMany(Collection, {
  through: CollectionCollectionRelation,
  as: "ParentId",
  otherKey: "ChildId"
});
Collection.belongsToMany(Collection, {
  through: CollectionCollectionRelation,
  as: "ChildId",
  otherKey: "ParentId"
});
CollectionCollectionRelation.removeAttribute("CollectionId"); // sequelize generates this useless attribute

const CollectionResourceRelation = RelationModel(
  sequelize,
  Sequelize,
  "CollectionResourceRelation",
  "CollectionId",
  "ResourceId"
);
Resource.belongsToMany(Collection, {
  through: CollectionResourceRelation
});
Collection.belongsToMany(Resource, {
  through: CollectionResourceRelation
});

const UserCommunityOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "UserCommunityOwnershipRelation",
  "UserId",
  "CommunityId"
);

Community.belongsToMany(User, {
  through: UserCommunityOwnershipRelation
});
User.belongsToMany(Community, {
  through: UserCommunityOwnershipRelation
});

const UserResourceOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "UserResourceOwnershipRelation",
  "UserId",
  "ResourceId"
);

Resource.belongsToMany(User, {
  through: UserResourceOwnershipRelation
});
User.belongsToMany(Resource, {
  through: UserResourceOwnershipRelation
});

const UserTagOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "UserTagOwnershipRelation",
  "UserId",
  "TagId"
);

Tag.belongsToMany(User, {
  through: UserTagOwnershipRelation
});
User.belongsToMany(Tag, {
  through: UserTagOwnershipRelation
});

const UserCollectionOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "UserCollectionOwnershipRelation",
  "UserId",
  "CollectionId"
);

Collection.belongsToMany(User, {
  through: UserCollectionOwnershipRelation
});
User.belongsToMany(Collection, {
  through: UserCollectionOwnershipRelation
});

const CommunityCollectionOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "CommunityCollectionOwnershipRelation",
  "CommunityId",
  "CollectionId"
);

Collection.belongsToMany(Community, {
  through: CommunityCollectionOwnershipRelation
});
Community.belongsToMany(Collection, {
  through: CommunityCollectionOwnershipRelation
});

const CommunityTagOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "CommunityTagOwnershipRelation",
  "CommunityId",
  "TagId"
);

Tag.belongsToMany(Community, {
  through: CommunityTagOwnershipRelation
});
Community.belongsToMany(Tag, {
  through: CommunityTagOwnershipRelation
});

const CommunityResourceOwnershipRelation = OwnershipRelationModel(
  sequelize,
  Sequelize,
  "CommunityResourceOwnershipRelation",
  "CommunityId",
  "ResourceId"
);

Resource.belongsToMany(Community, {
  through: CommunityResourceOwnershipRelation
});
Community.belongsToMany(Resource, {
  through: CommunityResourceOwnershipRelation
});

const TagResourceRelation = RelationModel(
  sequelize,
  Sequelize,
  "TagResourceRelation",
  "TagId",
  "ResourceId"
);
Resource.belongsToMany(Tag, {
  through: TagResourceRelation
});
Tag.belongsToMany(Resource, {
  through: TagResourceRelation
});

const TagCollectionRelation = RelationModel(
  sequelize,
  Sequelize,
  "TagCollectionRelation",
  "TagId",
  "CollectionId"
);
Collection.belongsToMany(Tag, {
  through: TagCollectionRelation
});
Tag.belongsToMany(Collection, {
  through: TagCollectionRelation
});

SearchRecord.belongsTo(User);

const ModelDocs = Gendoc(sequelize)
  .auto()
  .toString();

const Models = {
  Collection,
  CollectionCollectionRelation,
  CollectionResourceRelation,
  Community,
  CommunityCollectionOwnershipRelation,
  CommunityResourceOwnershipRelation,
  CommunityTagOwnershipRelation,
  CommunityUserRelation,
  ModelDocs, // The docs detailing the Models
  Resource,
  SearchRecord,
  Tag,
  TagCollectionRelation,
  TagResourceRelation,
  Theme,
  User,
  UserCollectionOwnershipRelation,
  UserCommunityOwnershipRelation,
  UserResourceOwnershipRelation,
  UserTagOwnershipRelation,
  sequelize
};

const connection = {};

export default async () => {
  if (connection.isConnected) {
    console.log("=> Using existing connection.");
    return Models;
  }

  await sequelize.sync({ force: true /**alter: { drop: false }*/ });
  await sequelize.authenticate();
  connection.isConnected = true;
  console.log("=> Created a new connection.");
  return Models;
};

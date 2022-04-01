const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const MONGO_URL =
  "mongodb://localhost:27017/proficient?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const db = async () => {
  try {
    mongoose.connection.on("open", async function (ref) {
      console.log("Connected to mongo server.");
      // trying to get collection names
      //   mongoose.connection.db.listCollections().toArray(function (err, names) {
      //     console.log(names); // [{ name: 'dbname.myCollection' }]
      //     module.exports.Collection = usersames;
      //   });

      // const rolesModel = mongoose.connection.db.collection("roles");
      // const userRoleMapModel = mongoose.connection.db.collection("userrolemaps");
      // const userModel = mongoose.connection.db.collection("users");
      const inviteUserModel = mongoose.connection.db.collection("inviteusers");

      const invites = await inviteUserModel
        .aggregate([
          { "$match": { "isDeleted": false } },
          {
            "$lookup": {
              "from": "users",
              "let": { "userroleId": "$to" },
              "pipeline": [
                {
                  "$match": {
                    "$and": [
                      {
                        "$expr":
                          { "$eq": ["$email", "$$userroleId"] }
                      }
                    ]
                  }
                },
                {
                  "$project": {
                    '_id': 1,
                    'isDeleted': 1,
                    'roleId': 1,
                    'mobileNumber': 1,
                    "name": 1,
                    "email": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                  }
                }
              ],
              "as": "user"
            }
          },
          { "$unwind": { "path": "$user", "preserveNullAndEmptyArrays": true } },
          { "$match": { "user": { "$ne": null } } },
          {
            "$lookup": {
              "from": "userrolemaps",
              "let": { "userId": { "$toString": "$user._id" } },
              "pipeline": [
                { "$addFields": { "companyid": { "$toObjectId": "$companyId" } } },
                { "$addFields": { "projectid": { "$toObjectId": "$projectId" } } },
                { "$addFields": { "userRoleId": { "$toObjectId": "$userRoleId" } } },
                {
                  "$match": {
                    "$and": [
                      { "$expr": { "$eq": ["$userId", "$$userId"] } },
                      { 'action': 'Active' },
                      { 'isDeleted': false }
                    ]
                  }
                },
                {
                  "$project": {
                    "companyId": 1,
                    "projectId": 1,
                    "action": 1,
                    "isActive": 1,
                    "userRoleId": 1,
                    'isDeleted': 1,
                  }
                },
                // Roles
                {
                  "$lookup": {
                    "from": "roles",
                    "let": { "userroleId": { "$toObjectId": "$userRoleId" } },
                    "pipeline": [
                      {
                        "$match": {
                          "$and": [
                            { "$expr": { "$eq": ["$_id", "$$userroleId"] } }
                          ]
                        }
                      },
                      { "$project": { "role": 1 } }
                    ],
                    "as": "Role"
                  }
                },
                { "$unwind": { "path": "$Role", "preserveNullAndEmptyArrays": true } },
                // Projects
                {
                  "$lookup": {
                    "from": "projects",
                    "let": { "projectId": { "$toObjectId": "$projectId" } },
                    "pipeline": [
                      {
                        "$match": {
                          "$and": [
                            { "$or": [{ "$expr": { "$eq": ["$_id", "$$projectId"] } }] }
                          ]
                        }
                      }
                    ],
                    "as": "project"
                  }
                },
                // Companies
                {
                  "$lookup": {
                    "from": "companies",
                    "let": { "companyId": { "$toObjectId": "$companyId" } },
                    "pipeline": [
                      {
                        "$match": {
                          "$and": [
                            { "$expr": { "$eq": ["$_id", "$$companyId"] } }
                          ]
                        }
                      }
                    ],
                    "as": "company"
                  }
                },
                { "$unwind": { "path": "$project", "preserveNullAndEmptyArrays": true } },
                { "$unwind": { "path": "$company", "preserveNullAndEmptyArrays": true } },
                // { "$addFields": { "userRoleId": { "$toObjectId": "$userRoleId" } } },
              ],
              "as": "userrolemaps"
            }
          },
          { "$unwind": { "path": "$userrolemaps", "preserveNullAndEmptyArrays": true } }
        ])
        .toArray();


        const invites1 = await inviteUserModel
        .aggregate([
          { "$match": { "isDeleted": false } },
          {
            "$lookup": {
              "from": "users",
              "let": { "userroleId": "$to" },
              "pipeline": [
                {
                  "$match": {
                    "$and": [
                      {
                        "$expr":
                          { "$eq": ["$email", "$$userroleId"] }
                      }
                    ]
                  }
                },
                {
                  "$project": {
                    '_id': 1,
                    'isDeleted': 1,
                    'roleId': 1,
                    'mobileNumber': 1,
                    "name": 1,
                    "email": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                  }
                }
              ],
              "as": "user"
            }
          },
          { "$unwind": { "path": "$user", "preserveNullAndEmptyArrays": true } },
          { "$match": { "user": { "$ne": null } } },
          {
            "$lookup": {
              "from": "userrolemaps",
              "let": { "userId": { "$toString": "$user._id" } },
              "pipeline": [
                { "$addFields": { "companyid": { "$toObjectId": "$companyId" } } },
                { "$addFields": { "projectid": { "$toObjectId": "$projectId" } } },
                { "$addFields": { "userRoleId": { "$toObjectId": "$userRoleId" } } },
                {
                  "$match": {
                    "$and": [
                      { "$expr": { "$eq": ["$userId", "$$userId"] } },
                      { 'action': 'Active' },
                      { 'isDeleted': false }
                    ]
                  }
                },
                {
                  "$project": {
                    "companyId": 1,
                    "projectId": 1,
                    "action": 1,
                    "isActive": 1,
                    "userRoleId": 1,
                    'isDeleted': 1,
                  }
                },
                // Roles
                {
                  "$lookup": {
                    "from": "roles",
                    "let": { "userroleId": { "$toObjectId": "$userRoleId" } },
                    "pipeline": [
                      {
                        "$match": {
                          "$and": [
                            { "$expr": { "$eq": ["$_id", "$$userroleId"] } }
                          ]
                        }
                      },
                      { "$project": { "role": 1 } }
                    ],
                    "as": "Role"
                  }
                },
                { "$unwind": { "path": "$Role", "preserveNullAndEmptyArrays": true } },
                // Projects
                {
                  "$lookup": {
                    "from": "projects",
                    "let": { "projectId": { "$toObjectId": "$projectId" } },
                    "pipeline": [
                      {
                        "$match": {
                          "$and": [
                            { "$or": [{ "$expr": { "$eq": ["$_id", "$$projectId"] } }] }
                          ]
                        }
                      }
                    ],
                    "as": "project"
                  }
                },
                // Companies
                {
                  "$lookup": {
                    "from": "companies",
                    "let": { "companyId": { "$toObjectId": "$companyId" } },
                    "pipeline": [
                      {
                        "$match": {
                          "$and": [
                            { "$expr": { "$eq": ["$_id", "$$companyId"] } }
                          ]
                        }
                      }
                    ],
                    "as": "company"
                  }
                },
                { "$unwind": { "path": "$project", "preserveNullAndEmptyArrays": true } },
                { "$unwind": { "path": "$company", "preserveNullAndEmptyArrays": true } },
                // { "$addFields": { "userRoleId": { "$toObjectId": "$userRoleId" } } },
              ],
              "as": "userrolemaps"
            }
          },
          { "$unwind": { "path": "$userrolemaps", "preserveNullAndEmptyArrays": true } }
        ])
        .toArray();

      // We have to get invites for following roles only.
      const roleNames = ["Company Admin" , "Users"];
      const sepInvites = roleNames.reduce((acc, value) => ({ ...acc, [value]: invites1.filter((invite) => invite?.userrolemaps?.Role?.role === value) }), {});
      
      // console.log("🚀 invites", sepInvites);
      console.log("🚀 invites", JSON.stringify(sepInvites, null, 2));
      process.exit(1)
    });

    // End

    console.log("connecting ...");
    const options = {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };
    await mongoose.connect(MONGO_URL, options);
  } catch (error) {
    console.log("Not connected", error);
    process.exit(1)
  }
};

db();
// module.exports = db


// // We are fetching roleIds based on role names.
// const roleIds = await rolesModel.find({ role: { $in: roleNames } }).toArray();
// // We have to check in the roleMaps table for the users which are under roles.
// const rolesMap = await userRoleMapModel.find({ userRoleId: { $in: roleIds.map(({ _id }) => _id.toString()) } }).toArray();
// // We have to list out all users based on rolesMap output.
// const users = await userModel.find({ _id: { $in: rolesMap.map(({ userId }) => ObjectId(userId)) } }).toArray();
// // We are finding invites.
// const _invites = await inviteUserModel.find({ to: { $in: users.map(({ email: to }) => to) } }).toArray();
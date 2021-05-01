const {MongoClient, ObjectID} = require('mongodb');
const {dbConnString} = require('config');

/*
async function getDb() {
  const client =
    await MongoClient.connect(dbConnString, {useNewUrlParser: true,
                                             useUnifiedTopology: true});
  const db = client.db();
  db.client = client;
  return db;
}
*/

function asObjectID(idstr) {
  return new ObjectID(idstr);
}

module.exports = {
  asObjectID,
  getDb
}
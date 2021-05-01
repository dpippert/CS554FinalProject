const MongoClient = require('mongodb').MongoClient;

// ----------------------------------------------------------------------------
// Configuration used by the system.
// ----------------------------------------------------------------------------

const appConfig = {
  dbName: 'tempest',
  dbUrl: 'mongodb://localhost:27017/'
};

let cn = db = undefined;

async function dbConnection() {
  const opts = {useNewUrlParser: true, useUnifiedTopology: true};
  if (!cn) {
    cn = await MongoClient.connect(appConfig.dbUrl, opts);
    db = await cn.db(appConfig.dbName);
  }
  return db;
};

const getCollectionFn = (collection) => {
  return async () => {
    const db = await dbConnection();
    return await db.collection(collection);
  }
};

module.exports = {
  appConfig,
  db: {
    dbConnection,
    questions: getCollectionFn('questions')
  }
};

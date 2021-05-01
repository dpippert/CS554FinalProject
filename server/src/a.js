const {db} = require('./config');

const w = console.warn

async function main() {
  const Q = await db.questions();
  const x = await Q.find({});
  const {insertedCount} = await Q.insertOne({t: "CSS",
                                             q: "The C in CSS stands for this word.",
                                             a: ["cascading"]});
  w(y);
}

main().then(async _ => {
  const cn = await db.dbConnection();
  await cn.serverConfig.close();
});

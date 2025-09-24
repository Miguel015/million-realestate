const { MongoClient, ObjectId } = require("mongodb");

function toMaybeObjectId(v) {
  if (!v) return v;
  if (typeof v === "string" && /^[0-9a-fA-F]{24}$/.test(v)) return new ObjectId(v);
  if (typeof v === "object" && v.$oid && /^[0-9a-fA-F]{24}$/.test(v.$oid)) return new ObjectId(v.$oid);
  return v;
}
function revive(doc) {
  if (Array.isArray(doc)) return doc.map(revive);
  if (doc && typeof doc === "object") {
    const out = {};
    for (const [k, v] of Object.entries(doc)) {
      if (k === "_id" || k === "ownerId") out[k] = toMaybeObjectId(v);
      else out[k] = revive(v);
    }
    return out;
  }
  return doc;
}
function toPascalProperty(p) {
  return {
    Name: p.name,
    Address: p.address,
    Price: p.price,
    CodeInternal: p.codeInternal,
    Year: p.year,
    OwnerId: toMaybeObjectId(p.ownerId),
    Images: (p.images || []).map(img => ({ _id: img._id, File: img.file, Enabled: img.enabled })),
    Traces: (p.traces || []).map(t => ({ _id: t._id || undefined, DateSale: t.dateSale, Name: t.name, Value: t.value, Tax: t.tax })),
    CreatedAt: new Date(),
    UpdatedAt: new Date()
  };
}
async function safeCreateIndex(col, spec, options) {
  try { await col.createIndex(spec, options); } 
  catch (err) { if (err.codeName !== "IndexOptionsConflict") throw err; }
}

(async () => {
  const client = new MongoClient("mongodb://localhost:27017");
  const db = client.db("milliondb"); // coincide con tu appsettings
  try {
    await client.connect();
    const ownersRaw = require("./owners.data");
    const propsRaw = require("./properties.data");
    const owners = revive(ownersRaw);
    const properties = revive(propsRaw).map(toPascalProperty);

    await db.collection("owners").deleteMany({});
    await db.collection("properties").deleteMany({});
    await db.collection("owners").insertMany(owners);
    await db.collection("properties").insertMany(properties);

    await safeCreateIndex(db.collection("properties"), { Name: "text", Address: "text" });
    await safeCreateIndex(db.collection("properties"), { Price: 1 });
    await safeCreateIndex(db.collection("properties"), { OwnerId: 1 });
    await safeCreateIndex(db.collection("properties"), { CreatedAt: -1 });
    await safeCreateIndex(db.collection("owners"), { Name: "text" });

    const c1 = await db.collection("owners").countDocuments();
    const c2 = await db.collection("properties").countDocuments();
    console.log(`✅ Seed OK → owners: ${c1}, properties: ${c2}`);
  } finally {
    await client.close();
  }
})();

// Initialize replica set first
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
});

// Wait until PRIMARY is elected
sleep(8000);

// Now create root user
db = db.getSiblingDB("admin");
db.createUser({
  user: "root",
  pwd: "example",
  roles: [ { role: "root", db: "admin" } ]
});

use("SmartHomeDB");

db.createCollection("users");

db.users.insertOne({
    username: "admin",
    password: "haslo123"
});

db.users.find().limit(5);
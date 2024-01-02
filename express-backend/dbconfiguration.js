use("SmartHomeDB");

db.createCollection("users");

db.users.insertOne({
    username: "admin",
    password: "$2b$10$iSQ3Q0TtN34axVvx8ZaluOALrZ6z1N1vff7bhTaagCkTe4Yw12uOW"
});

db.users.find().limit(5);
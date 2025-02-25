require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL Database Connected");
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MySQL:", err);
  });

sequelize
  .sync({ force: false })
  .then(() => console.log("Database & tables synced successfully"))
  .catch((error) => console.error("Error syncing the database:", error));

module.exports = sequelize;

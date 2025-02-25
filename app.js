const express = require("express");
const app = express();
const morgan = require("morgan");

const EmployeeRoutes = require("./routes/employeeRoute.js");
const DepartmentRoutes = require("./routes/departmentRoute.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/employees", EmployeeRoutes);
app.use("/api/v1/departments", DepartmentRoutes);

module.exports = app;

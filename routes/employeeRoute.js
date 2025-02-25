const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  addEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeeStatistics,
  getYoungestemployPerDepart,
} = require("../controllers/employeeController.js");

const upload = require('../middlewares/uploadeMiddellware.js');


router.get("/getEmployees", getAllEmployees);

router.post("/addEmployees", upload.single('image'),addEmployee);

router.put("/editEmployees/:id", upload.single('image') ,editEmployee);

router.delete("/deleteEmployees/:id", deleteEmployee);

router.get("/employees/statistics", getEmployeeStatistics);

router.get("/youngEmploy", getYoungestemployPerDepart);


module.exports = router;

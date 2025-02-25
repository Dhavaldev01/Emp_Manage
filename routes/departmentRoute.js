const express = require("express");
const {
  getAllDepartments,
  addDepartment,
  editDepartment,
  deleteDepartment,
} = require("../controllers/departmentController.js");

const router = express.Router();

router.get("/getAlldepartment", getAllDepartments);

router.post("/addDepartment", addDepartment);

router.put("/edit/:id", editDepartment);

router.delete("/delete/:id", deleteDepartment);

module.exports = router;

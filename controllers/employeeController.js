require("dotenv").config();
const { literal } = require("sequelize");
const { Op } = require("sequelize");
const { fn, col } = require("sequelize");

const Employee = require("../models/employeeModel.js");
const Department = require("../models/departmentModel.js");
const AppError = require("../Helpers/AppError");
const catchAsync = require("../Helpers/catchAsync");

const { validateEmployee } = require("../Helpers/validate");
const sequelize = require("../config/database.js");

exports.addEmployee = catchAsync(async (req, res, next) => {

  const validationError = validateEmployee(req.body);

  if (validationError) return next(new AppError(validationError, 400));

  const { departmentId, name, dob, phone, photo, email, salary, status } =
    req.body;

  const imagePath = req.file ? req.file.path : null;

  if (!imagePath) {
    return next(new AppError("Please Add Photo FIle ", 400));
  }

  const employee = await Employee.create({
    departmentId,
    name,
    dob,
    phone,
    photo: imagePath,
    email,
    salary,
    status,
  });

  if (!employee) {
    return next(new AppError("Emplyed are not created Please Try Adai!", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Employee Added Successfully",
    data: employee,
  });
});

exports.getAllEmployees = catchAsync(async (req, res, next) => {

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const employees = await Employee.findAll({
    // inlued use for the join the table
    include: [
      {
        model: Department,
        as: "department",
        attributes: ["name"], // that return department name filed
      },
    ],
    limit: parseInt(limit),
    skip: parseInt(skip),
  });

  if (!employees) {
    return next(new AppError("Not Found Any Document !", 400));
  }

  const totalEmployees = await Employee.count();

  return res.status(200).json({
    success: true,
    message: "Employees get  Successfully",
    data: employees,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalEmployees,
      totalPages: Math.ceil(totalEmployees / limit),
    },
  });
});

exports.editEmployee = catchAsync(async (req, res, next) => {

  const { id } = req.params;
  const { departmentId, name, dob, phone, email, salary, status } = req.body;

  const imagePath = req.file ? req.file.path : null;

  const validationError = validateEmployee(req.body);
  if (validationError) return next(new AppError(validationError, 400));

  const employee = await Employee.findByPk(id);
  if (!employee)
    return next(new AppError("Empolyed Not found Please Try Again !", 404));

  if (imagePath && employee.photo) {
    if (fs.existsSync(employee.photo)) {
      fs.unlinkSync(employee.photo);
    }
    employee.photo = imagePath;
  }

  if (departmentId) employee.departmentId = departmentId;
  if (name) employee.name = name;
  if (dob) employee.dob = dob;
  if (phone) employee.phone = phone;
  if (email) employee.email = email;
  if (salary) employee.salary = salary;
  if (status) employee.status = status;

  await employee.save();

  return res.status(200).json({
    success: true,
    message: "Employee Updated Successfully",
    data: employee,
  });
});

exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const employee = await Employee.findByPk(id);

  if (!employee) return next(new AppError("Employee Not Found", 404));

  await employee.destroy();

  return res.status(200).json({
    success: true,
    message: "Employee Deleted Successfully",
  });
});

exports.getEmployeeStatistics = catchAsync(async (req, res, next) => {

  const { salaryRanges } = req.query;

  if (!salaryRanges) {
    return next(new AppError("Salary ranges are required", 400));
  }

  const ranges = salaryRanges.split(",");
    const caseWhenQuery = ranges
      .map((range) => {
        const [min, max] = range.split("-");
        return max
          ? `WHEN salary BETWEEN ${min} AND ${max} THEN '${range}'`
          : `WHEN salary > ${min} THEN '${range}'`;
      })
      .join(" ");

    const salaryRangeStats = await Employee.findAll({
      attributes: [
        [fn("COUNT", col("id")), "employeeCount"],
        [literal(`(CASE ${caseWhenQuery} ELSE 'Unknown' END)`), "salaryRange"],
      ],
      group: [literal(`(CASE ${caseWhenQuery} ELSE 'Unknown' END)`)],
      raw: true,
    });

    const departmentSalary = await Employee.findAll({
      attributes: [[fn("MAX", col("salary")), "highestSalary"], "departmentId"],
      group: ["departmentId"],
      include: { model: Department, as: "department", attributes: ["name"] },
      raw: true,
    });

    res.status(200).json({
      success: true,
      message: "Statistics Fetched Successfully",
      data: { salaryRangeStats, departmentSalary },
    });
 
});

exports.getYoungestemployPerDepart = catchAsync(async (req, res, next) => {

    const youngestEmployees = await sequelize.query(
      `
      SELECT
        e.name,
        TIMESTAMPDIFF(YEAR, e.dob, CURDATE()) AS age,
        e.departmentId
      FROM employees e
      INNER JOIN departments d ON e.departmentId = d.id
      WHERE e.dob = (
        SELECT MIN(dob)
        FROM employees
        WHERE departmentId = e.departmentId
      )
      ORDER BY e.departmentId;
      `,
      { type: sequelize.QueryTypes.SELECT } 
    );


    if(youngestEmployees){
      return next(new AppError("Get Youngest Enployed ouccer Error ! Please Try Again "))
    }

    res.status(200).json({
      success: true,
      message: 'Youngest employ per depat get successfully',
      data: youngestEmployees,
    });
});


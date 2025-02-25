const Department = require("../models/departmentModel");
const AppError = require("../Helpers/AppError");
const catchAsync = require("../Helpers/catchAsync");
const { validateDepartment } = require("../Helpers/validate");

exports.getAllDepartments = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const departments = await Department.findAll({
    limit: parseInt(limit),
    skip: parseInt(skip),
  });

  if (!departments) {
    return next(new AppError("Department Are Not Get Please Try Again", 400));
  }
  const totalDepartments = await Department.count();

  return res.status(200).json({
    success: true,
    message: "Departments get Successfully",
    data: departments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalDepartments,
      totalPages: Math.ceil(totalDepartments / limit),
    },
  });
});

exports.addDepartment = catchAsync(async (req, res, next) => {
  // console.log(req.body)

  const validationError = validateDepartment(req.body);

  if (validationError) return next(new AppError(validationError, 400));

  const { name, status } = req.body;

  const department = await Department.create({
    name,
    status,
  });
  // console.log(department)

  if (!department) {
    return next(
      new AppError("Depatment Are Not Created ! Please Try Again", 400)
    );
  }

  return res.status(201).json({
    success: true,
    message: "Department Added Successfully",
    data: department,
  });
});

exports.editDepartment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const validationError = validateDepartment(req.body);
  // console.log(req.body)

  if (validationError) return next(new AppError(validationError, 400));

  const department = await Department.findByPk(id);

  if (!department)
    return next(new AppError("Department Not Found! Please Try Agian", 404));

  await department.update(req.body);

  return res.status(200).json({
    success: true,
    message: "Department Updated Successfully",
    data: department,
  });
});

exports.deleteDepartment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const department = await Department.findByPk(id);

  if (!department)
    return next(
      new AppError("Department Not Found ! Please Try Another id ", 400)
    );

  await department.destroy();

  return res.status(200).json({
    success: true,
    message: "Department Deleted Successfully",
  });
});

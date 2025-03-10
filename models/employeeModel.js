
const { DataTypes } = require('sequelize');
const sequelize = require("../config/database.js");
const Department = require('../models/departmentModel.js'); 
const validator = require("validator");

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'departments', 
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: false, 
        validate: {
            notEmpty: { msg: "DOB is required." },
            isDate: { msg: "Invalid date format for dob." } 
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
            notEmpty: { msg: "Phone number is required." },
            isNumeric: { msg: "number must contain only number" },
            len: { args: [10, 10], msg: "number must be exactly 10 digits" } 
        }
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email must be unique." },
        validate: {
            notEmpty: { msg: "Email is required." },
            isEmail(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email format.");
                }
            }
        }
    },
    salary: {
        type: DataTypes.FLOAT,
        allowNull: false, 
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active', 
    },
    created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, 
        allowNull: false,
    },
    modified: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, 
        allowNull: false,
    },
}, {
    timestamps: false, 
    tableName: 'employees', 
});

Employee.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });



module.exports = Employee;

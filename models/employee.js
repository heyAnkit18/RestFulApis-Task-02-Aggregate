const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
  name: String,
  joiningDate: Date,
  position: String,
  department: String,
},{timestamps:true});


const Employee = mongoose.model('Employee', employeeSchema,"Employee");

module.exports = Employee;

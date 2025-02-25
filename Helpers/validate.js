exports.validateEmployee = (body) => {
    if (!body.name || !body.dob || !body.phone || !body.email || !body.salary || !body.departmentId) {
      return "All Fields Are Required";
    }
    return null; 
  };
  

  exports.validateDepartment = (body) => {
    if (!body.name || !body.status) {
      return "All Fields Are Required";
    }
  
    return null; 
  };
  
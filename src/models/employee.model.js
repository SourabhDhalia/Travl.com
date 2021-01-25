const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EmployeeSchema = new mongoose.Schema({
    Password:{
        type:String,
        required:true
    },

    ConfirmPassword:{
        type:String,
        required:true
   
    },

});
employeeSchema.pre("save", async function(next){
    if(this.isModified("Password")){
    // const passwordHash = await bcrypt.hash(password,10);

        console.log(`the current Password is ${this.Password}`);
  this.Password = await bcrypt.hash(this.Password,10);
  console.log(`the current Password is ${this.Password}`);
this.ConfirmPassword = undefined;
}
    next();
})

//now we need to createa collection

const Register = new mongoose.model("Register" , employeeSchema);
module.exports = Register;

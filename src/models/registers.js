const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const employeeSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },


    Email:{
        type:String,
        required:true,
        unique:true
    },


    Password:{
        type:String,
        required:true
    },

    ConfirmPassword:{
        type:String,
        required:true
   
    },
    resetLink:{
        data:String,
        default:''
    },
})
//pre -> pehle ka kam
//use post for baad ka kam in employeeSchema.___

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




// const ContactuSchema = new mongoose.Schema({
//     Name:{
//         type:String,
//         required:true
//     },


//     Email:{
//         type:String,
//         required:true,
//         unique:true
//     },


//    Subject :{
//         type:String,
//         required:true
//     },

// });
// // const  = new
//  mongoose.model("Contactu" , ContactuSchema);
// // module.exports = ;
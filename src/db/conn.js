const mongoose = require("mongoose")


mongoose.connect(process.env.MDBKEY,{
  
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log(`connection successful`);
}).catch((e)=>{
    console.log(`no connection`);
});
// require('./db');

// 
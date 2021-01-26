const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://register:<password>@travl.xgnwl.mongodb.net/<dbname>?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log(`connection successful`);
}).catch((e)=>{
    console.log(`no connection`);
});

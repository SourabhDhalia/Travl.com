# Usage
install nodejs
and after this watch 
https://youtu.be/UfeqbB3SLfI 
=====================
# In new terminal --> 
install updates : npm i init
and then run .....
 npm start
 Or
 npm run dev 
# Visit http://localhost:3000

change package.json for dev purpose

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon src/app.js -e js,hbs",
    "start": "nodemon src/app.js -e js,hbs"
  },
  # 
and 
# 
  in file ./src/db/conn.js 
        ---> replace process.env.MDBKEY with your mongoDB api
        either atlas or mongodb://localhost:27017/
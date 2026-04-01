require("dotenv").config();
const app = require('./src/app');
const connectDB = require('./src/config/database');



// Connect to the database
connectDB();



const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
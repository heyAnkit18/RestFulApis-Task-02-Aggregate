const mongoose = require('mongoose');

const connectDB = async () => {
    console.log("hello")
  try {
    const conn = await mongoose.connect('mongodb+srv://ankitkumarjune18:uG4vqHCFpcAujQvM@cluster0.gobwq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected Sucessfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Oops Error Occur: ${error.message}`);
    process.exit(1); 
  }
};
// connectDB()

module.exports = connectDB;
require('dotenv').config();
const mongoose = require('mongoose');

const password = process.env.MONGO_ATLAS_PASSWORD
const url = process.env.MONGO_ATLAS_URL.replace('<password>', password);

mongoose.set('strictQuery', false)

mongoose.connect(url)
.then(result => {
  console.log("Connected to the database")
}).catch(error => {
  console.log("Problem with database connection.")
  console.log(error)
})

const personSchema = new mongoose.Schema({ 
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }

})

const Person = mongoose.model('Person', personSchema);

module.exports = Person;

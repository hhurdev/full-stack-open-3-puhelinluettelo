require('dotenv').config();
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please give a password as an argument: node mongo.js <password>')
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log('Too many arguments.')
  process.exit(1)
}

const password = process.argv[2]
const url = process.env.MONGO_ATLAS_URL.replace('<password>', password);

mongoose.connect(url)

const personSchema = new mongoose.Schema({ 
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // log koko popula
  Person.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // Add a new person
  const name = process.argv[3]
  const number = process.argv[4]

  const newPerson = new Person({
    name,
    number
  });

  newPerson.save().then(result => {
    console.log(`Added ${name} number ${number} to the phonebook`);
    mongoose.connection.close();
  });
} else {
  mongoose.connection.close();
  console.log("Did nothing, connection closed. Please give a password as an argument: node mongo.js <password>")
}
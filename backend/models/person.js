require('dotenv').config()
const mongoose = require('mongoose')

const password = process.env.MONGO_ATLAS_PASSWORD
const url = process.env.MONGO_ATLAS_URL.replace('<password>', password)

mongoose.set('strictQuery', false)

mongoose.connect(url)
  // eslint-disable-next-line no-unused-vars
  .then(result => {
    console.log('Connected to the database')
  }).catch(error => {
    console.log('Problem with database connection.')
    console.log(error)
  })

// luodaan skeema ja validointisäännöt
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return v.length >= 8 && /^(\d{2,3})-(\d+)$/.test(v)
      },
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }

})

const Person = mongoose.model('Person', personSchema)

module.exports = Person

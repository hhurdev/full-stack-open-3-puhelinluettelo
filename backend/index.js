const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
//tarkastaa onko dist-kansiossa staattisia tiedostoja, jos on, palauttaa ne jos niitä pyydetään
app.use(express.static('dist'))
// called every time a request with a JSON payload comes in
app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}

// called on every request
app.use(cors(corsOptions))

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// HELPERS
// -----------------------------------

const personExists = (name) => {
  console.log("personExists")
  return Person.find({ name: name })
    .then(persons => {
      if(persons.length > 0) {
        return true
      } else {
        return false
      }
    })
}

// ROUTES
// -----------------------------------

app.get('/', (req, res) => {
  res.send('<h1>Phonebook app<h1>')
})

app.post('/api/persons', (req, res, next) => {
  console.log("Posting person")
  const body = req.body
  console.log("body: ", body)

  personExists(body.name).then(exists => {
    console.log(`personExists has run: ${exists}`)
    if (exists) {
      return res.status(400).json({
        "error" : "Person has already been added!"
      })
    } else {
      // Add the person
      console.log("Adding person")
      const person = new Person({
        name: body.name,
        number: body.number
      })
    
      person.save()
        .then(savedPerson => {
          console.log(`Person saved to database.`)
          res.json(savedPerson)
        }).catch(err => {
          console.log("Couldn't save the new person.")
          next(err)
        })
    }
  });
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const id = req.params.id

  const newPerson = {
    name,
    number
  }

  // täytyy antaa normaali olio eikä Person oliota
  // new true koska muuten palauttaisi og olion eikä uutta
  // run validators: muuten ei validoisi dataa updatessa
  Person.findByIdAndUpdate(
    id,
    newPerson,
    {new: true, runValidators: true, context: 'query'}
  )
  .then(updatedPerson => {
    res.json(updatedPerson)
  })
  .catch(err => {
    console.log("Couldn't update the person's info")
    next(err)
  })
})

app.get('/api/persons', (req, res) => {
  // automatically stringifies the object & sets the header to application/json
  Person.find({}).then(persons => { 
    res.json(persons)
  })
})

app.get('/info', (req, res) => { 
  const date = new Date()
  Person.find({})
  .then(people => {
    const peopleLength = people.length
    res.send(`<p>Phonebook has info on ${peopleLength} people</p>
              <p>${date}<p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        console.log("Couldn't find person :(")
        res.status(404).end()
      }
    }).catch(err => {
      console.log("Error in finding the person by id")
      next(err)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      console.log(`Person with id ${id} deleted.`)
      res.status(204).end()
    }).catch(err => {
      console.log("Couldn't delete the person with id " + id)
      next(err)
    })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ err: "unknown endpoint"})
}

app.use(unknownEndpoint)

// ERROR HANDLING
// -----------------------------------

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  
  next(err)
}

app.use(errorHandler)

// PORT STUFF
// -----------------------------------

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

const personExists = (name) => {
  const found = persons.find(person => person.name.toLowerCase() === name.toLowerCase())
  if (found) {
    return true
  }
  return false
}

const generateId = () => { 
  const maxId = persons.length > 0
  ? Math.max(...persons.map(n => n.id)) 
  : 0

  return maxId
}

app.get('/', (req, res) => {
  res.send('<h1>HELLO THERE<h1>')
})

app.get('/api/persons', (req, res) => {
  // automatically stringifies the object & sets the header to application/json
  res.json(persons)
})

app.get('/info', (req, res) => { 
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p>${date}<p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (!person) {
    res.status(404).json({
      error: "Person not found in phonebook."
    })
    return;
  } 

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  // end: pyyntöön vastataan ilman dataa
  res.send(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      "error" : "content missing"
    })
  }

  if (personExists(body.name)) {
    return res.status(400).json({
      "error" : "Person has already been added!"
    })
  }

  const id = generateId() + 1

  const newPerson = {...body, "id": id}   

  persons = persons.concat(newPerson)
  res.json(newPerson)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
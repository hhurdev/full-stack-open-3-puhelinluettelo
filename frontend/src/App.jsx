/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import AddPersonForm from './components/AddPersonForm'
import Numbers from './components/Numbers'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotificationMessage] = useState(
    {
      message: '',
      type: ''
    })

  useEffect(() => {
    phonebookService
      .getAll()
      .then(people => {
        setPersons(people)
      })
      .catch(error => {
        showNotification({ message: 'Problem with retrieving people', type: 'error'});
      })
  }, [])
  
  const filteredPeople = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))

  const personExists = () => {
    const people = persons.map(person => person.name)
    const match = people.find((person) => person === newName)
    return match !== undefined
  }

  const showNotification = ({ message, type}) => {
    setNotificationMessage({ message, type})
    setTimeout(() => {
      setNotificationMessage({ message: '', type: ''})
    }, 5000)
  }

  const updatePersonData = (newPerson) => {
    if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)){
      const id = persons.find(person => person.name === newName).id

      phonebookService.update(id, newPerson)
      .then((returnedPerson) => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification({
          message: `Replaced number for ${returnedPerson.name}`,
          type: 'notification'})
      }).catch(error => {
        showNotification({ message: `Phone number edit failed.`, type: 'error'})
      })
    }
  }

  const validateInput = (newPerson) => {
    if (!newName) {
      alert('Please add a name')
      return false;
    }

    if (!newNumber) {
      alert('Please add a phone number')
      return false;
    }
  
    if (personExists()) {
      updatePersonData(newPerson)
      return false;
    }
  
    return true;
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }

    if (!validateInput(newPerson)) {
      return;
    }

    phonebookService.create(newPerson)
      .then((person) => {
        setPersons(persons.concat(person))
        setNewName('')
        setNewNumber('')
        showNotification({ message: `Added ${person.name}`, type: 'notification'} )
    }).catch(error => {
      showNotification({ message: `An error occurred with adding the person.`, type: 'error'} )
    })
  }

  const removePerson = (id) => {
    phonebookService.remove(id)
      .then((deletedPerson) => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type}/>
      <Filter handleFilterChange={handleFilterChange}/>
      <AddPersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <Numbers filteredPeople={filteredPeople} remove={removePerson}/>
    </>
  )

}

export default App
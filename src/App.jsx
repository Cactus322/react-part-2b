import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Person } from "./components/Person";
import { SearchForm } from "./components/SearchForm";
import { AddPersonForm } from "./components/AddPersonForm";
import personService from "./services/personService";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [newSearch, setNewSearch] = useState("");
	const [filteredPerson, setFilteredPerson] = useState([]);
	const [message, setMessage] = useState(null);
	const [messageClass, setMessageClass] = useState('error');

	useEffect(() => {
		personService.getAll()
		.then((responce) => {
			setPersons(responce.data);
		})
	}, [persons.length])

	const Notification = ({message}) => {
		if (message === null) {
			return null
		}

		return (
			<div>
				<p className={messageClass}>{message}</p>
			</div>
		)
	}

	const addPerson = (event) => {
		event.preventDefault();

		const personObject = {
			name: newName,
			number: newNumber
		}

		const personOldValues = persons.find(p => p.name === personObject.name);

		if (Object.values(personObject).filter( elem => elem === '').length > 0) {
			setMessageClass('error');
			setMessage('Fill in the empty fields');
			setTimeout(() => setMessage(null), 3000);
		} else if (personOldValues) {
			if (window.confirm(`${personOldValues.name} is already added to phonebook, replace the old number with a new one?`)) {
				const personNewValues = {...personOldValues, number: personObject.number};

				personService.changeNumber(personNewValues.id, personNewValues)
				.then((responce) => {
					setPersons(persons.map(person => person.id !== personOldValues.id ? person : responce.data))
					
					personService.getAll()
					.then((responce) => {
						setPersons(responce.data);
					})
				})
				.catch(error => {
					setMessageClass('error');
					setMessage(error.response.data.error);
				})

				setMessageClass('added');
				setMessage(`Changed ${personObject.name}`);
				setTimeout(() => setMessage(null), 3000);
			}
		} else {
			setPersons(persons.concat(personObject));
			personService
				.create(personObject)
				.then(createdPerson => {
					console.log(createdPerson);
				})
				.catch(error => {
					setMessageClass('error');
					setMessage(error.response.data.error);
				})
			
			setMessageClass('added');
			setMessage(`Added ${personObject.name}`);

			setTimeout(() => setMessage(null), 3000);
		}

		setFilteredPerson([]);
		setNewSearch("")
	};

	const deletePerson = (event) => {
		const id = event.target.id;
		const deletedPerson = persons.find(person => person.id === id);

		if (window.confirm(`Delete ${deletedPerson.name}?`)) {
			setPersons(persons.filter(person => person.id !== id))
			personService.personDelete(id)
			.catch(error => {
				setMessageClass('error')
				setMessage(`Information of ${deletedPerson.name} has already been removed from server`);
				setTimeout(() => setMessage(null), 3000);
			})
		}
	}

	const handlePersonChange = (event) => {
		setNewName(event.target.value);
	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	}

	const handleSearchChange = (event) => {
		setNewSearch(event.target.value);

		let searchValue = event.target.value.toLowerCase();
		let newArray = persons.map((person) => {
			if (person.name.toLowerCase().includes(searchValue)) {
				return person
			}

			return null
		});

		setFilteredPerson(newArray.filter(Boolean))
	}

	const DefaultPersonList = () => {
		return persons.map((person) => (
			<Person 
				id={person.id}
				person={person.name}
				number={person.number} 
				deletePerson={deletePerson} 
				key={nanoid()} 
			/>
		))
	}

	const FilteredPersonList = () => {
		return filteredPerson.map((person) => (
			<Person person={person.name} number={person.number} key={nanoid()} />
		))
	}

	const GetPersonList = () => {
		if (filteredPerson.length) {
		  return <FilteredPersonList />;
		} else {
			return <DefaultPersonList />
		}
	}

	const divStyles = {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: '200px'
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message}/>
			<SearchForm value={newSearch} changeForm={handleSearchChange} />
			<AddPersonForm 
				formStyles={divStyles} 
				submitForm={addPerson} 
				valueName={newName} 
				valueNumber={newNumber} 
				changeName={handlePersonChange}
				changeNumber={handleNumberChange}
			/>
			<h2>Numbers</h2>
			<ul>
				<GetPersonList />
			</ul>
		</div>
	);
};

export default App;

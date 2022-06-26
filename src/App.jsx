import { useEffect, useState } from "react";
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
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		personService.getAll()
		.then((responce) => {
			setPersons(responce.data);
		})
	}, [])

	const Notification = ({message}) => {
		if (message === null) {
			return null
		}

		return (
			<div>
				<p className="error">{message}</p>
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
			setErrorMessage('Fill in the empty fields');
			setTimeout(() => setErrorMessage(null), 3000);
		} else if (personOldValues) {
			if (window.confirm(`${personOldValues.name} is already added to phonebook, replace the old number with a new one?`)) {
				const personNewValues = {...personOldValues, number: personObject.number};

				personService.changeNumber(personNewValues.id, personNewValues)
				.then((responce) => {
					setPersons(persons.map(person => person.id !== personOldValues.id ? person : responce.data))
				})
			}
		} else {
			setPersons(persons.concat(personObject));
			personService.create(personObject);
		}

		setFilteredPerson([]);
		setNewSearch("")
	};

	const deletePerson = (event) => {
		const id = event.target.parentElement.id;
		const name = persons[id-1].name;

		if (window.confirm(`Delete ${name}?`)) {
			setPersons(persons.filter(person => person.id !== Number(id)))
			personService.personDelete(id);
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
				person={person.name}
				number={person.number} 
				id={person.id} 
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
			<Notification message={errorMessage}/>
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

import { useState } from "react";
import { nanoid } from "nanoid";
import { Person } from "./components/Person";
import { SearchForm } from "./components/SearchForm";
import { AddPersonForm } from "./components/AddPersonForm";

const App = () => {
	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas', number: '040-123456'},
		{ name: 'Ada Lovelace', number: '39-44-5323523'},
		{ name: 'Dan Abramov', number: '12-43-234345'},
		{ name: 'Mary Poppendieck', number: '39-23-6423122'}
	  ])
	

	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [newSearch, setNewSearch] = useState("");
	const [filteredPerson, setFilteredPerson] = useState([]);

	const addPerson = (event) => {
		event.preventDefault();

		const personObject = {
			name: newName,
			number: newNumber
		}

		if (persons.filter(person => person.name === personObject.name).length) {
			alert(`${personObject.name} is already added to phonebook`);
		} else {
			setPersons(persons.concat(personObject));
		}

		setFilteredPerson([]);
		setNewSearch("")
	};

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
			<Person person={person.name} number={person.number} key={nanoid()} />
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

import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
    return axios.get(baseUrl);
}

const create = personObject => {
    return axios.post(baseUrl, personObject);
}

const personDelete = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const changeNumber = (id, personNewValues) => {
    return axios.put(`${baseUrl}/${id}`, personNewValues)
}

const personService = {
    getAll,
    create,
    personDelete,
    changeNumber
}

export default personService;
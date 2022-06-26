export const Person = ({person, number, id, deletePerson}) => (
    <li id={id}>{person} {number} <button onClick={deletePerson}>delete</button></li>
)
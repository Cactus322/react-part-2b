export const Person = ({id, person, number, deletePerson}) => (
    <>
        <li className="person-list__item">
            <p className="name">{person}</p>
            <p className="number">{number}</p> 
            <button id={id} onClick={deletePerson}>delete</button>
        </li>
    </>
)

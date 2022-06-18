export const AddPersonForm = ({formStyles, submitForm, valueName, valueNumber, changeName, changeNumber}) => (
    <form onSubmit={submitForm}>
        <div style={formStyles}>
            name: <input value={valueName} onChange={changeName}/>
            number: <input value={valueNumber} onChange={changeNumber}/>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
)
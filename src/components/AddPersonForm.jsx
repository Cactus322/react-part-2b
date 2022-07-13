export const AddPersonForm = ({formStyles, submitForm, valueName, valueNumber, changeName, changeNumber}) => (
    <form onSubmit={submitForm}>
        <div style={formStyles}>
           
            <label for="name">name:</label>  
            <input id="name" value={valueName} onChange={changeName}/>

            <label for="number">number:</label>  
            <input id="number" value={valueNumber} onChange={changeNumber}/>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
)
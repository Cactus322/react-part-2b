export const SearchForm = ({value, changeForm}) => (
    <div>
        <p>filter shown with</p>
        <input value={value} onChange={changeForm}/>
    </div>
)
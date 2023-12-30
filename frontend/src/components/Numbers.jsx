/* eslint-disable react/prop-types */
const Numbers = ({ filteredPeople, remove }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {filteredPeople.map((person) => {
        return (
          <p key={person.id}>
            <span>{person.name} {person.number}   </span>
            <button onClick={() => remove(person.id)}>Remove</button>
          </p>
        );
      })}
    </div>
  );
};

export default Numbers;
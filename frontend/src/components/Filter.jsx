/* eslint-disable react/prop-types */

const Filter = ({ handleFilterChange }) => {
  return (
    <>
      <div>Filter shown with <input onChange={handleFilterChange} /></div>
    </>
  );
};

export default Filter;

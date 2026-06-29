import React, { useEffect, useState } from "react";

const RequirementField = ({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);

  useEffect(() => {
    register(name, {
      register: true,
      validate: (value) => value && value.length > 0,
    });
  }, []);

  useEffect(()=> {
    setValue(name,requirementList);
  },[requirementList]);

  const HandleAddRequirement = () => {
    if (requirement) {
      setRequirementList([...requirementList, requirement]);
      setRequirement("");
    }
  };
  const HandleRemoveRequirement = (index) => {
    const updatedRequirementList = [...requirementList];
    updatedRequirementList.splice(index, 1);
    setRequirementList(updatedRequirementList);
  };

  return (
    <>
      <div className="mb-1">
        <label htmlFor={name}>
          {label}
          <sup className="text-red-600">*</sup>{" "}
        </label>
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Enter Requirement / Instructions "
          className="w-full bg-richblack-700 rounded-md p-2 mt-2 " 
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        <button
          type="button"
          onClick={HandleAddRequirement}
          className="font-semibold text-yellow-50 mt-2  "
        >
          Add
        </button>
      </div>

      {requirementList.length > 0 && (
        <ul>
          {requirementList.map((requirement, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-richblack-5"
            >
              <span>{requirement}</span>
              <button
                type="button"
                className="text-xs text-pure-greys-300"
                onClick={() => HandleRemoveRequirement(index)}
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name] && <span>{label} is required</span>}
    </>
  );
};

export default RequirementField;

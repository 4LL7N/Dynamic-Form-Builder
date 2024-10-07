/* eslint-disable @typescript-eslint/no-explicit-any */


const FormField = ({ field, dispatch,register,unregister ,setRadioChosenValue,radioChosenValue}: any) => {
  function handleRemove(id: number) {
    // const data = fields.filter((item: any) => item.id != id);
    // setFields(data);
    unregister(field.label)
    dispatch({ type: 'REMOVE_FIELD', payload: id })
  }
//   let htmlString = `<div style={{display:"flex"}}   ><label htmlFor={${
//     field.label
//   }} >${field.label}</label><input  ${field.min != 0 ? `min=${field.min}` : ""} ${
//     field.max != 0 ? `max=${field.max}` : ""
//   } type=${field.type} ${
//     field.placeholder ? `placeholder=${field.placeholder}` : ""
//   } ${field.required ? "required" : ""} {...register("${field.label}")} className="formComponent" /></div>`;

//   if (field.type == "select") {
//     htmlString = `<div>
//           <label htmlFor=${field.label}>${field.label}</label>
//           <select
//           {...register("${field.label}")}
//             name=${field.label}
//             id=${field.label}
            
//           >
            
//           ${field.addoptions.map((item: any) => {
//             return `<option value=${item}>${item}</option>`;
//           })}
//           </select>
//         </div>`;
//   }

  const renderField = () => {        
    switch (field.type) {
      case 'text':
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <label htmlFor={field.label}>{field.label}</label>
            <input
              id={field.label}
              {...register(field.label,{required:field.required,minLength:field.min||undefined,maxLength:field.max||undefined,pattern:field.pattern||undefined})}
              type="text"
              placeholder={field.placeholder || ''}
              className="formComponent"
            />
          </div>
        );
      case 'number':
        return (
            <div style={{ display: "flex", gap: "10px" }}>
              <label htmlFor={field.label}>{field.label}</label>
              <input
                id={field.label}
                {...register(field.label,{required:field.required,min:field.min||undefined,max:field.max||undefined})}
                type="number"
                placeholder={field.placeholder || ''}
                className="formComponent"
              />
            </div>
          );
      case 'select':
        return (
          <div>
            <label htmlFor={field.label}>{field.label}</label>
            <select
              {...register(field.label)}
              id={field.label}
              name={field.label}
            >
              {field.addoptions?.map((option: any, index: number) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      case 'checkbox':
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <label htmlFor={field.label}>{field.label}</label>
            <input
              {...register(field.label)}
              type="checkbox"
              id={field.label}
            />
          </div>
        );
      case 'radio':
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <label htmlFor={field.label}>{field.label}</label>
            <input
              {...register(field.name)}
              type="radio"
              id={field.label}
              required={field.required}
              name={field.name}
              value={field.value}
              checked={radioChosenValue == field.value}
              onChange={(e)=>{setRadioChosenValue(e.target.value)}}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <span style={{ display: "flex", position: "relative", gap: "10px" }}>
      {renderField()}
      {/* <div dangerouslySetInnerHTML={{ __html: htmlString }} /> */}
      <button type="button" onClick={() => handleRemove(field.label)}>delete</button>
    </span>
  );
};

export default FormField;

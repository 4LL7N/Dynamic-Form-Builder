/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer, useRef, useState } from "react";
import FormField from "./FormField";
import Draggable from "react-draggable";
import { useForm } from "react-hook-form";

const initialState = {
    fields: []
  };

const reducer = (state:any, action:any) => {
  switch (action.type) {
    case 'ADD_FIELD':
      return { ...state, fields: [...state.fields, action.payload] };
    case 'ADD_FIELDS':
      return { ...state, fields: [...state.fields, ...action.payload] };
    case 'REMOVE_FIELD':
      return { ...state, fields: state.fields.filter((item:any) => item.label !== action.payload) };
    default:
      return state;
  }

};

const FormBuilder = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
  const [select, setSelect] = useState<string>("text");
  const label = useRef<any>();
  const placeholder = useRef<any>();
  const Options = useRef<any>()
  const Name = useRef<any>()
  const radioValue = useRef<any>()
  const [required, setRequired] = useState<boolean>(false);
  const [min, setMin] = useState<any>(0);
  const [max, setMax] = useState<any>(0);
  const [pattern, setPattern] = useState<string>('')
  const [addoptions,setAddoptions] =  useState<string[]>([])
  const [radioChosenValue,setRadioChosenValue] = useState()
  const [submitData,setSubmitData] = useState<any>()
  
  const {register,
    handleSubmit,
    formState: { errors },
    unregister
    } = useForm()

  const addField = (select: string, label: any,Name:any, radioValue:any,placeholder: any,min:number,max:number,required:boolean,pattern:string) => {
  
    const newField: any = {
      type: select,
      label: label.current.value,
      placeholder: placeholder.current.value,
      name:Name.current.value,
      value:radioValue.current.value,
      min,
      max,
      required,
      pattern,
      addoptions
    };
    console.log(newField);
    
    setAddoptions([])
    dispatch({ type: 'ADD_FIELD', payload: newField });
  };

  const addOptions = () => {
    setAddoptions([...addoptions,Options.current.value])
    Options.current.value = ""
  }

  useEffect(()=>{
    if(select != "select" )setAddoptions([])
  },[select])



  const onSubmit = (data:any)=>{
    console.log(data);
    setSubmitData(data)
  }

  const handleFile = (e:any) => {    
    const file = e.target.files?.[0]; // Get the uploaded file
    if (!file) return;

    const reader = new FileReader(); // Create a FileReader to read the file
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string); // Parse the JSON
        dispatch({ type: 'ADD_FIELDS', payload: json.fields })
      } catch (error) {
        console.error("Invalid JSON file", error);
      }
    };
    reader.readAsText(file); // Read the file as text
    e.target.value = ""
  }
  const JsonDownload = () => {
    const json = JSON.stringify(state.fields, null, 2); 
    const blob = new Blob([json], { type: 'application/json' }); 
    const link = document.createElement('a'); 
    link.href = URL.createObjectURL(blob); 
    link.download = 'form-config.json'; 
    link.click(); 
  }


  return (
    <div className="content" >
      <div id="build">
        <div>
          <label htmlFor="type-select">type</label>
          <select
            name="type"
            id="type-select"
            onChange={(e) => {
              setSelect(e.target.value);
            }}
          >
            <option value="text">text</option>
            <option value="checkbox">checkbox</option>
            <option value="radio">radio</option>
            <option value="number">number</option>
            <option value="select">select</option>
          </select>
        </div>
        {select == "select"?
        <div>
            <label htmlFor="options">options</label>
            <input ref={Options} type="text" id="options" name="options" />
            <button onClick={()=>addOptions()} >add options</button>
        </div>
        :
        null
        }
        <div>
          <label htmlFor="label">label</label>
          <input
            ref={label}
            type="text"
            id="label"
            name="label"
            placeholder="label"
          />
        </div>
        <div>
          <label htmlFor="name">name</label>
          <input
          ref={Name}
            type="text"
            name="name"
            id="name"
           
          />
        </div>
        <div>
          <label htmlFor="value">radio value</label>
          <input
          ref={radioValue}
            type="text"
            name="value"
            id="value"
           
          />
        </div>
        <div>
          <label htmlFor="placeholder">placeholder</label>
          <input
            type="text"
            id="placeholder"
            name="placeholder"
            placeholder="placeholder"
            ref={placeholder}
          />
        </div>
        <div>
          <label htmlFor="required">required</label>
          <input
            type="checkbox"
            name="required"
            id="required"
            onChange={() => {
              setRequired(!required);
            }}
          />
        </div>
        <div>
          <label htmlFor="min">min</label>
          <input
            type="number"
            name="min"
            id="min"
            defaultValue={0}
            onChange={(e) => {
              setMin(Number(e.target.value));
            }}
          />
        </div>
        <div>
          <label htmlFor="max">max</label>
          <input
            type="number"
            name="max"
            id="max"
            defaultValue={0}
            onChange={(e) => {
              setMax(Number(e.target.value));
            }}
          />
        </div>
        <div>
          <label htmlFor="pattern">patter</label>
          <input
            type="text"
            name="patter"
            id="patter"
            defaultValue={''}
            onChange={(e) => {
                setPattern(e.target.value);
            }}
          />
        </div>
          <button onClick={() => addField(select, label,Name,radioValue ,placeholder,min,max,required,pattern)}>
            Add
          </button>
          <input type="file" name="" id="" accept="application/json" onChange={handleFile} />
      </div>
      <div className="preview" >
        <form onSubmit={handleSubmit(onSubmit)} className="previewForm" >
            <div>
        {state.fields.map((field: any, index: any) => (
          <Draggable key={field.id} cancel=".no-drag" >
            <div className="component" >
            <FormField
              key={index}
              field={field}
            dispatch={dispatch}
            register={register}
            unregister={unregister}
            setRadioChosenValue={setRadioChosenValue}
            radioChosenValue={radioChosenValue}
            /> 
            </div>
           </Draggable>
         ))} 
         </div>
         {errors && Object.keys(errors).length !== 0?
         <div>
            {Object.entries(errors).map((item:any)=>{
             return <p style={{color:'red',fontSize:'20px'}} >{item[0]} : {item[1].type}</p>
         })}
         </div>
         :null}
         {submitData && Object.keys(errors).length === 0 ?
         <div>
         {Object.entries(submitData).map((item:any)=>{
            console.log(item);
            
             return <p style={{color:'white',fontSize:'20px'}} >{item[0]} : {item[1]?.toString()}</p>
         })}
         </div>
         : null}
         <div style={{display:"flex"}} >
         <button type="submit" style={{marginBottom:"20px",marginRight:"20px"}} >Submit</button>
         <button type="button" onClick={JsonDownload} >download</button>
         </div>
         </form>
      </div>
    </div>
  );
};

export default FormBuilder;

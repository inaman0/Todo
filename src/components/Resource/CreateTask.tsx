import React, { useState, useEffect } from 'react';
    import apiConfig from '../../config/apiConfig';
import './CreateTask.css'
export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const CreateTask = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
     const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("task")
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Task")
  const [description,setDescription] = useState<string>('');
  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      const fetchedResources = new Set();
      const fetchedEnum = new Set();
      console.log("fectched resources",fetchedResources)
      try {
        const data = await fetch(
          metadataUrl,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (data.ok) {
          const metaData = await data.json();
          setResMetaData(metaData);
          setFields(metaData[0].fieldValues);
          const foreignFields = metaData[0].fieldValues.filter((field: any) => field.foreign);
          console.log("foreign fields",foreignFields)
          for (const field of foreignFields) {
            if (!fetchedResources.has(field.foreign)) {
              fetchedResources.add(field.foreign);
              await fetchForeignData(field.foreign, field.name, field.foreign_field);
            }
          }

            const enumFields = metaData[0].fieldValues.filter((field: any) => field.isEnum === true);
            for (const field of enumFields) {
              if (!fetchedEnum.has(field.possible_value)) {
                fetchedEnum.add(field.possible_value);
                await fetchEnumData(field.possible_value);
              }
            }
        } else {
          console.error('Failed to fetch components:', data.statusText);
        }
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };

    fetchResMetaData();
   
  }, []);

  useEffect(()=>{
    console.log("data to save",dataToSave)
  },[dataToSave])
  const fetchEnumData = async (enumName: string) => {
    try {
      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${enumName}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEnums((prev) => ({
          ...prev,
          [enumName]: data
        }));
      } else {
        console.error(`Error fetching enum data for ${enumName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching enum data for ${enumName}:`, error);
    }
  }

  const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
    
   
    try {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid);

      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${foreignResource.toLowerCase()}?`+params.toString(),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setForeignkeyData((prev) => ({
          ...prev,
          [foreignResource]: data.resource
        }));
        
      } else {
        console.error(`Error fetching foreign data for ${fieldName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching foreign data for ${fieldName}:`, error);
    }
  };

  const handleCreate = async () => {
    const params = new URLSearchParams();
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    params.append('resource', base64Encoded);
    const ssid: any = sessionStorage.getItem('key');
    params.append('session_id', ssid);
    
    const response = await fetch(apiUrl+`?`+params.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
    }
    setDescription('');
  };
  const handleCancel = () =>{
    setDataToSave({});
    setDescription('');
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  }; 

  return (
    <div className="create-task-container">
      <div className="form-grid">
    {/* {fields.map((field, index) => {
      if (field.name !== 'id' && !regex.test(field.name)) {
        if (field.foreign) {
          // Foreign key dropdown
          return (
            <div key={index} className="form-group">
              <label>
                {field.required && <span style={{ color: 'red' }}>*</span>} {field.name}
              </label>
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  {dataToSave[field.name] || `Select ${field.name}`}
                </button>
                <div className="dropdown-menu p-2">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={`Search ${field.name}`}
                    value={searchQueries[field.name] || ''}
                    onChange={(e) => handleSearchChange(field.name, e.target.value)}
                  />
                  {(foreignkeyData[field.foreign] || []).map((option, i) => (
                    <button
                      key={i}
                      className="dropdown-item"
                      onClick={() => setDataToSave({ ...dataToSave, [field.name]: option[field.foreign_field] })}
                    >
                      {option[field.foreign_field]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        } else if (field.isEnum === true) {
          // Enum select
          return (
            <div key={index} className="form-group">
              <label>
                {field.required && <span style={{ color: 'red' }}>*</span>} {field.name}
              </label>
              <select
                className="form-control"
                name={field.name}
                value={dataToSave[field.name] || ''}
                onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
              >
                <option value="">Select {field.name}</option>
                {enums[field.possible_value]?.map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </select>
            </div>
          );
        } else {
          // Input field
          return (
            <div key={index} className="form-group">
              <label>
                {field.required && <span style={{ color: 'red' }}>*</span>} {field.name}
              </label>
              <input
                type={field.type || 'text'}
                className="form-control"
                name={field.name}
                value={dataToSave[field.name] || ''}
                onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
              />
            </div>
          );
        }
      }
      return null;
    })} */}
      {fields.map((field, index) => {
      if(field.name === 'Task'){
        return (
          <div key={index} className="Task">
              <label className='Task_Title'>
                {field.required && <span style={{ color: 'red' }}>*</span>} Title
              </label>
              <input
                type={field.type || 'text'}
                className="Task_Input"
                name={field.name}
                value={dataToSave[field.name] || ''}
                onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
              />
            </div>
        )
        
      }
      else if(field.name === 'Due_Date'){
        return (
          <>
            <div key={index} className="Due_Date">
              <label className='Due_Date_Title'>
                {field.required && <span style={{ color: 'red' }}>*</span>} {field.name}
              </label>
              <input
                type={field.type || 'text'}
                className="Due_Date_Input"
                name={field.name}
                value={dataToSave[field.name] || ''}
                onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
              />
            </div>
            <div className='Description'>
              <label className='Description_Title'>
                Description
              </label>
              <input 
                type='textarea'
                className='Description_Input'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </>
          
        )
      }
      else if (field.foreign) {
        // Foreign key dropdown
        return (
          <div key={index} className="User">
            <label className='User_Title'>
              {field.required && <span style={{ color: 'red' }}>*</span>} {field.name}
            </label>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                {dataToSave[field.name] || `Select ${field.name}`}
              </button>
              <div className="dropdown-menu p-2">
                {/* <input
                  type="text"
                  className="form-control mb-2"
                  placeholder={`Search ${field.name}`}
                  value={searchQueries[field.name] || ''}
                  onChange={(e) => handleSearchChange(field.name, e.target.value)}
                /> */}
                {(foreignkeyData[field.foreign] || []).map((option, i) => (
                  <button
                    key={i}
                    className="dropdown-item"
                    onClick={() => setDataToSave({ ...dataToSave, [field.name]: option[field.foreign_field] })}
                  >
                    {option[field.foreign_field]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }
      else if (field.isEnum === true) {
        // Enum select
        return (
          <div key={index} className="Enum">
            <label className='Enum_Title'>
              {field.required && <span style={{ color: 'red' }}>*</span>} {field.name}
            </label>
            <select
              className="Enum_Input"
              name={field.name}
              value={dataToSave[field.name] || ''}
              onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
            >
              <option value="">Select {field.name}</option>
              {enums[field.possible_value]?.map((val, idx) => (
                <option key={idx} value={val}>{val}</option>
              ))}
            </select>
          </div>
        );
      }
      else if(field.name === 'Attachment'){
        return (
          <div key={index} className="Attachment">
              <label className='Atachment_Title'>
                {field.required && <span style={{ color: 'red' }}>*</span>} {field.name}
              </label>
              <input
                type={field.type || 'text'}
                className="Attachment_Input"
                name={field.name}
                value={dataToSave[field.name] || ''}
                onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
              />
            </div>
        )
      }
      else if(field.name === 'Comment_Section'){
        return (
          <div key={index} className="Comment">
              <label className='Comment_Title'>
                {field.required && <span style={{ color: 'red' }}>*</span>} {field.name}
              </label>
              <input
                type={field.type || 'textarea'}
                className="Comment_Input"
                name={field.name}
                value={dataToSave[field.name] || ''}
                onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
              />
            </div>
        )
      }
      })}

      </div>
      <div className="button-row">
        <button className="btn btn-primary" onClick={handleCreate}>Create</button>
        <button className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
      </div>
    </div>

)


};

export default CreateTask
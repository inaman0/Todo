import React, { useState } from 'react';
                  import { useEffect } from 'react';
                  import apiConfig from '../../config/apiConfig';
                   import {
              AllCommunityModule,
              ModuleRegistry,
              themeAlpine,
              themeBalham,
            } from "ag-grid-community";
            import { AgGridReact } from "ag-grid-react";
            
            ModuleRegistry.registerModules([AllCommunityModule]);
                  export type ResourceMetaData = {
                    "resource": string,
                    "fieldValues":any[]
                  }
  
                  const ReadTask= () => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [colDef1, setColDef1] = useState<any[]>([]);
    const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);
   const [showToast,setShowToast] = useState<any>(false);

  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = `${apiConfig.getResourceUrl('task')}?`
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Task')}?`
  const BaseUrl = '${apiConfig.API_BASE_URL}';
  // Fetch resource data
  useEffect(() => {
    const fetchResourceData = async () => {
      console.log('Fetching data...');
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      const queryId: any = 'GET_ALL';
      params.append('queryId', queryId);
      params.append('session_id', ssid);
      try {
        const response = await fetch(
          apiUrl+params.toString(),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Error:'+ response.status);
        }
        const data = await response.json();
        console.log('Data after fetching', data);
        setFetchedData(data.resource || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchResourceData();
  }, []);

  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      try {
        const response = await fetch(
          metadataUrl,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (response.ok) {
          const metaData = await response.json();
          setResMetaData(metaData);
          setFields(metaData[0]?.fieldValues || []);
          const required = metaData[0]?.fieldValues
            .filter((field: any) => !regex.test(field.name))
            .map((field: any) => field.name);
          setRequiredFields(required || []);
        } else {
          console.error('Failed to fetch metadata:'+ response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    fetchResMetaData();
  }, []);
  useEffect(() => {
    
    const data = fetchData || [];
    // console.log(data);
    const fields = requiredFields.filter(field => field !== 'id') || [];
    // console.log(fields);
    
    const columns = fields.map(field => ({
      field: field,
      headerName: field,
      editable: false,
      resizable: true,
      sortable: true,
      filter: true,
      cellStyle: (params: any) => {
        if (field === 'Priority') {
          if (params.value === 'Low') {
            return {
              color: 'white',
              backgroundColor: '#FDAB3D',
              border: '1px solid #ccc',
              textAlign: 'center'
            };
          }
          if (params.value === 'Medium') {
            return {
              color: 'white',
              backgroundColor: '#00C875',
              border: '1px solid #ccc',
              textAlign: 'center'
            };
          }
          if (params.value === 'High') {
            return {
              color: 'white',
              backgroundColor: '#DF2F4A',
              border: '1px solid #ccc',
              textAlign: 'center'
            };
          }
        }
        else if (field === 'Status') {
          if (params.value === 'To do') {
            return {
              color: '#33C4AF',
              backgroundColor: '#CCF0EB',
              border: '1px solid #ccc',
              textAlign: 'center'
            };
          }
          if (params.value === 'In progress') {
            return {
              color: '#6A30F0',
              backgroundColor: '#E0D4FC',
              border: '1px solid #ccc',
              textAlign: 'center'
            };
          }
          if (params.value === 'Done') {
            return {
              color: '#F47467',
              backgroundColor: '#FCD7D4',
              border: '1px solid #ccc',
              textAlign: 'center'
            };
          }
        }
        return {
          border: '1px solid #ccc'
        };
      }
    }));
    
    
    setColDef1(columns);
    setRowData(data);
  }, [fetchData, requiredFields]);

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    editable: false,
  }; 

  return (
    <div>
  
      {rowData.length === 0 && colDef1.length === 0 ? (
        <div>No data available. Please add a resource attribute.</div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDef1}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          rowSelection="multiple"
          
        />
      </div>
      )}
    </div>

    )
    
    
    };
    
    export default ReadTask
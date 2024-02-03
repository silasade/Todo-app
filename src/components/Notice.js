import React from 'react';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';


function Notice() {
  return (
   
    <Alert key="danger" variant="danger" className='notie'>
       You need to login before you can use the App
  </Alert>
  );
}

export default Notice;

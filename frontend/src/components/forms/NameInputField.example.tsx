/**
 * Example usage of NameInputField component
 * This file demonstrates how to use the NameInputField in a form
 */

import React, { useState } from 'react';
import { NameInputField } from './index';

export function NameInputFieldExample() {
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  
  // Example predefined options
  const surnameOptions = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
  const firstNameOptions = ['John', 'Jane', 'Michael', 'Sarah', 'David'];
  const middleNameOptions = ['Alexander', 'Marie', 'James', 'Elizabeth', 'Robert'];

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Registration Form Example</h2>
      
      {/* With dropdown options */}
      <NameInputField
        label="Surname"
        name="surname"
        value={surname}
        onChange={setSurname}
        options={surnameOptions}
        required
      />
      
      {/* With dropdown options */}
      <NameInputField
        label="First Name"
        name="firstName"
        value={firstName}
        onChange={setFirstName}
        options={firstNameOptions}
        required
      />
      
      {/* Text input only (no options) */}
      <NameInputField
        label="Middle Name"
        name="middleName"
        value={middleName}
        onChange={setMiddleName}
        placeholder="Enter your middle name"
        required
      />
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Values:</h3>
        <p>Surname: {surname || '(empty)'}</p>
        <p>First Name: {firstName || '(empty)'}</p>
        <p>Middle Name: {middleName || '(empty)'}</p>
      </div>
    </div>
  );
}

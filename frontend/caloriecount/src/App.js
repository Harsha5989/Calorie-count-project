import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userData, setUserData] = useState({
    userId: '',
    Gender: '',
    Age: '',
    Height: '',
    Weight: '',
    Duration: '',
    Heart_Rate: '',
    Body_Temp: '',
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // const resu = await axios.post('http://192.168.50.62:5000/save', { data: userData });
    fetch('http://127.0.0.1:5000/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Convert userData to JSON format
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        if (data.success) {
          alert(data.message); // Show success message
        } else {
          alert(data.message); // Show error message if success is false
        }

        // Reset form fields after submission
        setUserData({
          userId: '',
          Gender: '',
          Age: '',
          Height: '',
          Weight: '',
          Duration: '',
          Heart_Rate: '',
          Body_Temp: '',
        });
      })
      .catch((error) => {
        console.error('There was an error saving the data!', error);
        alert('An error occurred while saving the data. Please try again.');
      });
  };


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   axios.post('http://localhost:5000/save', userData)
  //     .then((response) => {
  //       alert(response.data.message);
  //       setUserData({
  //         userId: '',
  //         Gender: '',
  //         Age: '',
  //         Height: '',
  //         Weight: '',
  //         Duration: '',
  //         Heart_Rate: '',
  //         Body_Temp: '',
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('There was an error saving the data!', error);
  //     });
  // };

  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const calculateResult = () => {
    axios.get(`http://127.0.0.1:5000/res?userId=${userId}`)
      .then(response => {
        if (response.data.result) {
          setResult(response.data.result["0"] + " calories");
        } else {
          setResult("No data found for this User ID");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setResult("No data found for the provided UserId");
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Health Data Collection</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="userId"
          placeholder="User ID"
          value={userData.userId}
          onChange={handleChange}
          required
        /><br />


        {/* <select value={userData.Gender} onChange={handleChange}> */}

        <label htmlFor="dropdown"></label>
        <select id="dropdown"
          name='Gender' value={userData.Gender} onChange={handleChange}>
          <option value="">Gender</option>
          <option value="0">0 (women)</option>
          <option value="1">1(men)</option>
        </select>
        <br />

        <input
          type="number"
          name="Age"
          placeholder="Age"
          value={userData.Age}
          onChange={handleChange}
          required
        /><br />

        <input
          type="number"
          name="Height"
          placeholder="Height (cm)"
          value={userData.Height}
          onChange={handleChange}
          required
        /><br />

        <input
          type="number"
          name="Weight"
          placeholder="Weight (kg)"
          value={userData.Weight}
          onChange={handleChange}
          required
        /><br />

        <input
          type="number"
          name="Duration"
          placeholder="Duration (min)"
          value={userData.Duration}
          onChange={handleChange}
          required
        /><br />

        <input
          type="number"
          name="Heart_Rate"
          placeholder="Heart Rate"
          value={userData.Heart_Rate}
          onChange={handleChange}
          required
        /><br />

        <input
          type="number"
          name="Body_Temp"
          placeholder="Body Temperature"
          value={userData.Body_Temp}
          onChange={handleChange}
          required
        /><br />

        <button type="submit">Save Data</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h2>Calculate Calories</h2>
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={handleUserIdChange}
          required
        />
        <button onClick={calculateResult}>Calculate</button>
      </div>

      {result && (
        <div style={{
          border: '1px solid #ccc',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
          width: '200px',
          textAlign: 'center',
        }}>
          <span>{result}</span>
        </div>
      )}
    </div>
  );
}

export default App;

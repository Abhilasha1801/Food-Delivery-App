import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" })
  let [address, setAddress] = useState("");
  let navigate = useNavigate()

  const handleClick = async (e) => {
    // Get current position and reverse-geocode it via backend
    try {
      // Request geolocation (will prompt user for permission)
      const navLocation = () => new Promise((res, rej) => {
        if (!navigator.geolocation) return rej(new Error('Geolocation not supported'));
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 10000 });
      });

      const pos = await navLocation();
      const lat = pos.coords.latitude;
      const long = pos.coords.longitude;
      // console.log(lat, long)

      const response = await fetch("http://localhost:5000/api/auth/getlocation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latlong: { lat, long } })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Reverse geocode failed: ${text}`);
      }

      const { location } = await response.json();
      // Update both the local address input and the credentials.geolocation field
      setAddress(location || '');
      setCredentials(prev => ({ ...prev, geolocation: location || '' }));
    } catch (err) {
      console.error('Error fetching location:', err);
      // Provide a more descriptive message to the user depending on the error type
      const code = err && err.code;
      let message = err && err.message ? err.message : String(err);
      if (code === 1) { // PERMISSION_DENIED
        alert('Location permission denied. Please allow location access in your browser (click the lock icon near the address bar and enable Location) or enter the address manually.');
      } else if (code === 2) { // POSITION_UNAVAILABLE
        alert('Position unavailable: ' + message + '\nTry again or enter the address manually.');
      } else if (code === 3) { // TIMEOUT
        alert('Location request timed out. Try again or enter the address manually.');
      } else {
        alert('Unable to get current location: ' + message + '\nCheck browser permissions or enter address manually.');
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation checks
      if (!credentials.name || credentials.name.length < 3) {
        alert("Name should be at least 3 characters long");
        return;
      }
      if (!credentials.email || !credentials.email.includes('@')) {
        alert("Please enter a valid email address");
        return;
      }
      if (!credentials.password || credentials.password.length < 5) {
        alert("Password should be at least 5 characters long");
        return;
      }
      if (!credentials.geolocation) {
        alert("Please provide a location or use the 'Click for current Location' button");
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation // this is the location field
        })
      });

      const json = await response.json();
      console.log(json);
      
      if (json.success) {
        localStorage.setItem('token', json.authToken);
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        // Show the specific error from the backend
        alert(json.error || "Registration failed. Please check your details.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration. Please try again.");
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address') {
      setAddress(value);
      setCredentials(prev => ({ ...prev, geolocation: value }));
    } else {
      setCredentials(prev => ({ ...prev, [name]: value }));
    }
  }

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover',height: '100vh' }}>
      <div>
      <Navbar />
      </div>

        <div className='container' >
          <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
            <div className="m-3">
              <label htmlFor="name" className="form-label text-white">Name</label>
              <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="email" className="form-label text-white">Email address</label>
              <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="address" className="form-label text-white">Address</label>
              <fieldset>
                <input type="text" className="form-control" name='address' placeholder='"Click below for fetching address"' value={address} onChange={(e)=>setAddress(e.target.value)} aria-describedby="emailHelp" />
              </fieldset>
            </div>
            <div className="m-3">
              <button type="button" onClick={handleClick} name="geolocation" className=" btn btn-success">Click for current Location </button>
            </div>
            <div className="m-3">
              <label htmlFor="exampleInputPassword1" className="form-label text-white">Password</label>
              <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' />
            </div>
            <button type="submit" className="m-3 btn btn-success">Submit</button>
            <Link to="/login" className="m-3 mx-1 btn btn-danger">Already a user</Link>
          </form>
        </div>
      </div>
  )
}
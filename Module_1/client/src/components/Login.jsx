import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
function Login(){
  const Server = "http://localhost:3000";
  const [user,setUser]=useState({})


  // useEffect(()=>{
  // const getting= jwtDecode(localStorage.getItem('token'));

  // if(getting?.UserRole=="admin"){
  //   navigate('/admin')
  //   console.log(getting)
  // }
  // else if(getting?.UserRole=="Staff"){
  //   navigate('/staff')
  // }
  // else{
  //   navigate("/")
  // }
  // },[]) 

  // uncomment the code for better understanding

  const navigate=useNavigate();

     async function handleSubmit(e) {
      e.preventDefault();
      await axios.post(Server+"/login",user).then(res=>{
        if(!res.data.token){
          alert(res.data.message)
          return ;
        }
        const decoded=jwtDecode(res.data.token)
        localStorage.setItem('token',res.data.token)

        

        if(decoded.UserRole=='admin'){
          navigate('/admin')
        }
        else  if(decoded.UserRole=='Staff'){
          navigate('/staff')
        }
        else{
          alert(res.data.message)
        }
      })
     }
    return(
        <>
         <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0 px-4 py-4 bg-white rounded">
            <div className="card-body">
              <h2 className="card-title text-center mb-4 fw-bold text-dark">Login Account</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label text-secondary small fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={(e)=>{
                      setUser({...user,email:e.target.value})
                    }}
                    placeholder="name@example.com"
                  
                    required
                  />
                </div>

                
                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label text-secondary small fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Enter secure password"
                    onChange={(e)=>{
                      setUser({...user,password:e.target.value})
                    }}
                    required
                  />
                </div>

                

                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mb-3">
                  Login
                </button>
                
            
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
        </>
    )
}
export default Login

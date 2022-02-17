import React, { useState, useContext } from 'react'

import AuthContext from '../context/auth-context'

import './Auth.css';

const AuthPage = (props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);  
  const { login } = useContext(AuthContext)

  const handleEmailChange = (evt) => {
    setEmail(evt.target.value);
  }

  const handlePasswordChange = (evt) => {
    setPassword(evt.target.value);
  }

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  }

  const submitHandler = async (evt) => {
    evt.preventDefault();

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    }

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password:"${password}"}){
              _id
              email
            }
          }
        `
      };
    }

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed!');
      }
      if (response.data.login.token) {
        login(response.data.login.token, response.data.login.userId, response.data.login.tokenExpiration)
      }
      return response.json()
    } catch (error) {
        console.log(error);
    }
  }


  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" value={email} onChange={handleEmailChange} />
      </div>
      <div className="form-control">
      <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchModeHandler}>Switch to {isLogin ? 'Signup' : 'Login'}</button>
      </div>
    </form>
    
  )
}

export default AuthPage;
import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className='form-container'>
            <form>
                <h1>Login</h1>
                <input name='events_todo_email' type='email' placeholder='Email' />
                <input name='events_todo_password' type='password' placeholder='Password' />
                <div>
                    <input type='submit' value='Login' />
                    <Link to='/signup'>Signup</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
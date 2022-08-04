import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
    return (
        <div className='form-container'>
            <form>
                <h1>Signup</h1>
                <input name='events_todo_name' type='text' placeholder='Name' />
                <input name='events_todo_email' type='email' placeholder='Email' />
                <input name='events_todo_password' type='password' placeholder='Password' />
                <div>
                    <input type='submit' value='Signup' />
                    <Link to='/login'>Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;
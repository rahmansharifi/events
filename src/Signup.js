import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const Signup = () => {

    const forward = useNavigate();
    const cookies = new Cookies();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loader, setLoader] = useState(true);
    const [error, setError] = useState('');

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    async function submit(event) {
        event.preventDefault()
        nameRef.current.style.border = '1px solid #ffffff';
        emailRef.current.style.border = '1px solid #ffffff';
        passwordRef.current.style.border = '1px solid #ffffff';
        const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        if (!name) {
            setError('Name cant be empty')
            nameRef.current.style.border = '1px solid #ff0000';
            nameRef.current.style.boxShadow = 'none';
            nameRef.current.focus();
            return null;
        }
        else if (!email) {
            setError('Email cant be empty')
            emailRef.current.style.border = '1px solid #ff0000';
            emailRef.current.style.boxShadow = 'none';
            emailRef.current.focus();
            return null;
        }
        else if (!regex.test(email)) {
            setError('Address is invalid')
            emailRef.current.style.border = '1px solid #ff0000';
            emailRef.current.style.boxShadow = 'none';
            emailRef.current.focus();
            return null;
        }
        else if (!password) {
            setError('Password cant be empty')
            passwordRef.current.style.border = '1px solid #ff0000';
            passwordRef.current.style.boxShadow = 'none';
            passwordRef.current.focus();
            return null;
        }
        else if (password.length < 6 ) {
            setError('Enter 6 characters at least')
            passwordRef.current.style.border = '1px solid #ff0000';
            passwordRef.current.style.boxShadow = 'none';
            passwordRef.current.focus();
            return null;
        }
        setError('')
        setLoader(true)
        try {
            const call = await axios.post('https://api.rahmansharifi.ir/signup',{
                name: name,
                email: email,
                password: password,
            })
            if (call.data.http === 201) {
                cookies.set('auth',call.data.auth,{maxAge:7*24*60*60})
                forward('/events')
            } 
            else
            {
                throw new Error(call.data.exception)
            }
        } catch(e) {
            setLoader(false)
            setError((''+e).split('\n')[0].replace('Error: <email>','Email'))
        }
    }

    useEffect(()=>{
        async function sessionCheck() {
            const call = await axios.get('https://api.rahmansharifi.ir/me',{
                headers:{
                    'Authorization': 'Bearer '+cookies.get('auth')
                }
            })
            if (call.data.http === 200) {
                forward('/events')
            }
            else
            {
                setLoader(false);
            }
        }
        sessionCheck();
        // eslint-disable-next-line
    },[])

    return (
        <div className='form-container'>
            <form>
                <h1>Signup</h1>
                <input 
                    required
                    ref={nameRef}
                    name='events_todo_name' 
                    type='text' 
                    placeholder='Name' 
                    value={name}
                    onChange={event=>setName(event.target.value)}
                />
                <input 
                    required
                    ref={emailRef}
                    name='events_todo_email' 
                    type='email' 
                    placeholder='Email' 
                    value={email}
                    onChange={event=>setEmail(event.target.value)}
                />
                <input 
                    required
                    ref={passwordRef}
                    name='events_todo_password' 
                    type='password' 
                    placeholder='Password' 
                    value={password}
                    onChange={event=>setPassword(event.target.value)}
                />
                <div>
                    <input type='submit' value='Signup' onClick={submit} />
                    {
                        loader &&
                            <div className='loader'>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                    }
                    {
                        error &&
                            <div className='error'>{error}</div>
                    }
                    <Link to='/login'>Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;
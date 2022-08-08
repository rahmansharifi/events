import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const New = () => {

    const forward = useNavigate();
    const cookies = new Cookies();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [priority, setPriority] = useState('normal');

    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');

    const titleRef = useRef();
    const bodyRef = useRef();
    // const priorityRef = useRef();

    async function submit(event) {
        event.preventDefault()
        titleRef.current.style.border = '1px solid #ffffff';
        bodyRef.current.style.border = '1px solid #ffffff';
        // priorityRef.current.style.border = '1px solid #ffffff';
        if (!title) {
            setError('Title cant be empty')
            titleRef.current.style.border = '1px solid #ff0000';
            titleRef.current.style.boxShadow = 'none';
            titleRef.current.focus();
            return null;
        }
        else if (!body) {
            setError('Body cant be empty')
            bodyRef.current.style.border = '1px solid #ff0000';
            bodyRef.current.style.boxShadow = 'none';
            bodyRef.current.focus();
            return null;
        }
        // else if (!priority) {
        //     setError('Priority cant be empty')
        //     priorityRef.current.style.border = '1px solid #ff0000';
        //     priorityRef.current.style.boxShadow = 'none';
        //     priorityRef.current.focus();
        //     return null;
        // }
        setError('')
        setLoader(true)
        try {
            const call = await axios.post('https://api.rahmansharifi.ir/events/',{
                title: title,
                body: body,
                priority: priority,
            },
            {
                headers:{
                    'Authorization': 'Bearer '+cookies.get('auth')
                }
            })
            if (call.data.http === 200) {
                forward('/events')
            } 
            else
            {
                throw new Error(call.data.exception)
            }
        } catch(e) {
            setLoader(false)
            setError((''+e).split('\n')[0].replace('Error: ','').replace('<session>','Session'))
        }
    }

    return (
        <div className='form-container'>
            <form>
                <h1>Add Event</h1>
                <input 
                    required
                    autoComplete='off'
                    dir='auto'
                    ref={titleRef}
                    name='events_todo_title' 
                    type='text' 
                    placeholder='Title' 
                    value={title}
                    onChange={event=>setTitle(event.target.value)}
                />
                <textarea
                    required
                    dir='auto'
                    ref={bodyRef}
                    name='events_todo_body' 
                    type='text' 
                    placeholder='Body' 
                    value={body}
                    onChange={event=>setBody(event.target.value)}
                >{body}</textarea>
                <div className='priority-radio'>
                    <input
                        type='radio'
                        name='priority'
                        id='priority-hot'
                        checked={priority==='hot'}
                        onChange={event=>event.target.checked && setPriority('hot')}
                    />
                    <label htmlFor='priority-hot' className={priority==='hot'?'hot':''}>Hot</label>
                    <input
                        type='radio'
                        name='priority'
                        id='priority-normal'
                        checked={priority==='normal'}
                        onChange={event=>event.target.checked && setPriority('normal')}
                    />
                    <label htmlFor='priority-normal' className={priority==='normal'?'normal':''}>Normal</label>
                    <input
                        type='radio'
                        name='priority'
                        id='priority-cold'
                        checked={priority==='cold'}
                        onChange={event=>event.target.checked && setPriority('cold')}
                    />
                    <label htmlFor='priority-cold' className={priority==='cold'?'cold':''}>Cold</label>
                </div>
                <div>
                    <input type='submit' value='Add' onClick={submit} />
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
                    <Link to='/events'>Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default New;
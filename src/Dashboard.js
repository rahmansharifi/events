import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const Dashboard = () => {

    const forward = useNavigate();
    const cookies = new Cookies();

    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState('');
    const [events, setEvents] = useState({});
    const [user, setUser] = useState({});

    async function getUser(){
        const call = await axios.get('https://api.rahmansharifi.ir/me',{
            headers:{
                'Authorization': 'Bearer '+cookies.get('auth')
            }
        })
        if (call.data.http===200) {
            setUser(call.data.user)
        }
        else
        {
            throw new Error(call.data.exception)
        }
    }

    useEffect(()=>{
        async function get() {
            try {
                getUser();
                const call = await axios.get('https://api.rahmansharifi.ir/events/',{
                    headers:{
                        'Authorization': 'Bearer ' + cookies.get('auth')
                    }
                })
                if (call.data.http === 200) {
                    setLoader(false)
                    setEvents(call.data.events)
                }
                else
                {
                    throw new Error(call.data.exception)
                }
            } catch(e) {
                setLoader(false)
                setError((''+e).split('\n')[0])
            }
        }
        get()
        // eslint-disable-next-line
    },[])

    function logout() {
        document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        forward('/login');
    }

    return (
        <>
            <div className='search-container'>
                <input
                    name='events_todo_search'
                    type='text'
                    placeholder='Search...'
                    value={search}
                    onChange={event=>setSearch(event.target.value)}
                />
            </div>

            {
                !loader && !error &&
                    <div className='identifier'>
                        <div className='email'>{user.name}</div>
                        <div className='logout' onClick={logout}>Logout</div>
                    </div>
            }
            
            {
                error &&
                    <div className='error'>{error}</div>
            }
            <div className='cards'>
                {
                    loader &&
                    <div className='event-card dashboard-loading'>
                        <div></div>
                    </div>
                }
                {
                    !error && !loader &&
                        <div className='event-card new' onClick={()=>forward('/dashboard/events/new')}>
                            <div></div>
                            <div></div>
                        </div>
                }
                {
                    !error && !loader &&
                        Object.keys(events).map(key=>{
                            let item = events[key];
                            if (item.title.toLowerCase().includes(search.toLowerCase()) || item.body.toLowerCase().includes(search.toLowerCase())){
                                let card = 'event-card '+item.priority;
                                return <div key={key} className={card} onClick={()=>forward('/dashboard/events/'+key)}>
                                    <span>{item.priority}</span>
                                    <h3 dir='auto'>{item.title}</h3>
                                    <div className='boundary'>
                                        <p dir='auto'>{item.body}</p>
                                    </div>
                                </div>
                            }
                            else
                            {
                                return null;
                            }
                        })
                }
            </div>
        </>
    );
};

export default Dashboard;
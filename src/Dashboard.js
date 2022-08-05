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

    useEffect(()=>{
        async function get() {
            try {
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
                                return <div key={key} className={card}>
                                    <span>{item.priority}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.body}</p>
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
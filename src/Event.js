import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const Event = () => {

    const {event} = useParams();
    const forward = useNavigate();
    const cookies = new Cookies();

    const [loader, setLoader] = useState(true);
    const [error, setError] = useState('');
    const [events, setEvents] = useState({});

    const [pending, setPending] = useState(false);

    function timeConverter(unix){
        const a = new Date(unix*1000);
        return a.toLocaleDateString("en-US")+' '+a.toLocaleTimeString("en-US");
    }

    function breakLine(content) {
        let out = content.split('\n').map(line=><p dir='auto'>{line}</p>);
        return out.join('');
    }

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

    async function deleteEvent() {
        setPending(true)
        try {
            const call = await axios.delete('https://api.rahmansharifi.ir/events/'+event,{
                headers:{
                    'Authorization': 'Bearer ' + cookies.get('auth')
                }
            })
            if (call.data.http === 200) {
                forward('/dashboard/events')
            }
            else
            {
                throw new Error(call.data.exception)
            }
        } catch(e) {
            setPending(false)
            setError((''+e).split('\n')[0])
        }
    }

    return (
        <>
            <div className='header-container'>
                <div className='backward' onClick={()=>forward('/dashboard/events')}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h2>Event</h2>
            </div>
            
            {
                error &&
                    <div className='error'>{error}</div>
            }
            <div className='card-container'>
                {
                    loader &&
                    <div className='event-card event-loading'>
                        <div></div>
                    </div>
                }
                {
                    !error && !loader &&
                        Object.keys(events).map(key=>{
                            if (key===event){
                                let item = events[key];
                                let card = 'event-card '+item.priority;
                                return <div key={key} className={card}>
                                        <span>{item.priority}</span>
                                        <h3 dir='auto'>{item.title}</h3>
                                        <div className='boundary'>
                                            <p dir='auto'>{breakLine(item.body)}</p>
                                            <div className={'date-'+item.priority}>{timeConverter(item.created)}</div>
                                        </div>
                                        <div className='footer'>
                                            <button className={'button-'+item.priority} onClick={()=>forward('/dashboard/events/'+event+'/edit')}>Edit</button>
                                            <button className={'font-'+item.priority} onClick={deleteEvent}>{pending?<div></div>:'Delete'}</button>
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

export default Event;
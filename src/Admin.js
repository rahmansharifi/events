import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const Admin = () => {

    const forward = useNavigate();
    const cookies = new Cookies();

    const [loader, setLoader] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState({});

    function timeConverter(unix){
        const a = new Date(unix*1000);
        return a.toLocaleDateString("en-US")+' '+a.toLocaleTimeString("en-US");
    }

    function switchUser(userId) {
        cookies.set('auth',userId,{maxAge:7*24*60*60});
        forward('/events');
    }

    useEffect(()=>{
        async function get() {
            try {
                const call = await axios.get('https://api.rahmansharifi.ir/users',{
                    headers:{
                        'Authorization': 'Bearer ' + cookies.get('auth')
                    }
                })
                if (call.data.http === 200) {
                    setLoader(false)
                    setUsers(call.data.users)
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
            <div className='search-container' onClick={()=>forward('/events')}>
                <div className='backward'>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h2>Admin</h2>
            </div>
            
            {
                error &&
                    <div className='error'>{error}</div>
            }
            <div className='cards'>
                {
                    loader &&
                    <div className='event-card event-loading'>
                        <div></div>
                    </div>
                }
                {
                    !error && !loader &&
                        Object.keys(users).map(key=>{
                            let item = users[key];
                            return <div key={key} className='event-card user' onClick={()=>switchUser(key)}>
                                    <span>User</span>
                                    <h3 dir='auto'>{item.name}</h3>
                                    <pre>
                                        <p dir='auto'>{item.email}</p>
                                    </pre>
                                    <div className='date-user'>{timeConverter(item.created)}</div>
                                </div>
                        })
                }
            </div>
        </>
    );
};

export default Admin;
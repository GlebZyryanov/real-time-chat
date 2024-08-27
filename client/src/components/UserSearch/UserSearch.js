import React, {useContext, useEffect, useState} from 'react';
import { fetchUsers } from '../../utils/api';
import { SocketContext } from '../../contexts/SocketContext';
import "../../styles/user-search.css";


const UserSearch = ({ channelId }) => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const socket = useContext(SocketContext);

    const handleSearch = async () => {
        const results = await fetchUsers(query);
        setUsers(results);
    };

    const handleAddUser = (user) => {
        console.log('adding user:', user);
        socket.emit('join_channel', { channelId, user });
        setUsers([]);
        setQuery('');
    };

    return (
        <div className="user-search">
           <div className="user-search-card">
               <div className="user-search-form">
                   <input
                       className="form-control"
                       type="text"
                       placeholder="Поиск..."
                       value={query}
                       onChange={(e) => setQuery(e.target.value)}
                   />

                       <button onClick={handleSearch}>Поиск</button>

               </div>


               {users.length > 0 && (
                   <ul className="user-list">
                   {users.map((user) => (
                           <li key={user.id}>
                               <h4>{user.name}</h4>
                               <button onClick={() => handleAddUser(user)}>Добавить</button>
                           </li>
                       ))}
                   </ul>
               )}
           </div>
        </div>
    );
};

export default UserSearch;

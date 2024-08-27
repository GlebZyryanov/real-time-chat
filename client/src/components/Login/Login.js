import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { fetchUsers } from '../../utils/api';
import '../../styles/login.css';

const Login = () => {
    const { login } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSearch = async () => {
        const users = await fetchUsers(username);
        setUserList(users);
    };

    const handleLogin = () => {
        if (selectedUser) {
            login(selectedUser);
        }
    };

    return (
        <div className="login-container">
            <div className="login-page">
                <div className="login-card">
                    <h2>Вход</h2>
                    <div className="login-form">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Введите имя пользователя или email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="login-btns">
                        <button onClick={handleSearch}>Поиск</button>
                        <button onClick={handleLogin} disabled={!selectedUser}>
                            Войти
                        </button>
                    </div>
                    {userList.length > 0 && (
                        <ul className="user-list">
                            {userList.map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={selectedUser?.id === user.id ? 'selected' : ''}
                                >
                                    {user.name} ({user.username})
                                </li>
                            ))}
                        </ul>
                    )}


                </div>
            </div>
        </div>
    );
};

export default Login;

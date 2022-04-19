/* eslint-disable linebreak-style */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Routes, Route, Link, useNavigate,
} from 'react-router-dom'

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [chatrooms, setChatrooms] = useState([])

  useEffect(() => {
    const intervalID = setInterval(() => {
      const getChatroom = async () => {
        const { data } = await axios.get('api/chatroom')
        console.log(data)
        setChatrooms(data)
      }

      getChatroom()
      const check = async () => {
        const user = await axios.get('/account/logged')
        if (user.data == null || user.data === '') {
          setLoggedIn(false)
        } else {
          setUsername(user.data)
          setLoggedIn(true)
        }
      }
      check()
    }, 2000)
    return () => clearInterval(intervalID)
  }, [])

  const check = async () => {
    const user = await axios.get('/account/logged')
    if (user.data == null || user.data === '') {
      setLoggedIn(false)
    } else {
      setUsername(user.data)
      setLoggedIn(true)
    }
  }
  check()

  const logout = async () => {
    await axios.post('/account/logout')
    setUsername('')
    setLoggedIn(false)
  }

  const navigate = useNavigate()

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home username={username} password={password} setLoggedIn={setLoggedIn} loggedIn={loggedIn} navigate={navigate} logout={logout} chatrooms={chatrooms} />} />
        <Route path="signup" element={<Signup username={username} password={password} setUsername={setUsername} setPassword={setPassword} navigate={navigate} loggedIn={loggedIn} />} />
        <Route path="login" element={<Login username={username} password={password} setUsername={setUsername} setPassword={setPassword} navigate={navigate} loggedIn={loggedIn} />} />
      </Routes>
    </div>
  )
}

function Home({
  username, password, loggedIn, setLoggedIn, navigate, logout, chatrooms,
}) {
  const [roomname, setRoomname] = useState('')
  const [roompass, setRoompass] = useState('')
  const [joinRoom, setJoinRoom] = useState('')
  const [joinPass, setJoinPass] = useState('')
  const [selected, setSelected] = useState('')
  const create = async () => {
    try {
      const asd = await axios.post('/api/chatroom/add', { user: username, roomname, password: roompass })
      if (asd.data === 'question failed to submit') {
        throw new Error('question failed to submit')
      }
    } catch (error) {
      console.log(error)
      alert('question failed to submit')
    }
  }

  const join = async () => {
    try {
      const asd = await axios.post('/api/chatroom/adduser', { roomname: joinRoom, password: joinPass, user: username })
      if (asd.data === 'question failed to submit') {
        throw new Error('question failed to submit')
      }
    } catch (error) {
      console.log(error)
      alert('question failed to submit')
    }
  }

  return (
    <div className="container-fluid">
      <h1>Chatter</h1>
      {loggedIn
        && (
          <>
            <div>
              <h1>
                {`Hello ${username}`}
              </h1>
              <button className="btn btn-outline-danger float-right" onClick={() => logout()}>Logout</button>
            </div>
            <br />
            <button type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target="#Create">
              Create a New Chatroom
            </button>
            <button type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target="#Join">
              Join a Private Chatroom
            </button>
            <div className="row">
              <div className="col">
                <h3>Chatrooms</h3>
                {chatrooms.map(chatroom => (
                  (!chatroom.password || chatroom.users.includes(username)) && (
                  <div className="card">
                    <button
                      className="btn"
                      onClick={() => {
                        setSelected(chatroom._id)
                      }}
                    >
                      {`Room Name: ${chatroom.roomname}`}
                      <br />
                      {`Admin: ${chatroom.admin}`}
                      <br />
                      {chatroom.password && (
                      <>
                        {`Users: ${chatroom.users}`}
                      </>
                      )}
                    </button>
                  </div>
                  ))).reverse()}
              </div>
              <div className="col-9">
                {chatrooms.filter(u => u._id === selected).map(chatroom => (
                  (!chatroom.password || chatroom.users.includes(username)) && (
                  <div className="card">
                    <div className="card-header">
                      {chatroom.roomname}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {`Admin: ${chatroom.admin}`}
                        <br />
                        {chatroom.password && (
                        <>
                          {`Users: ${chatroom.users}`}
                        </>
                        )}
                      </h5>
                      <p className="card-text">
                        {chatroom.messages.map(m => (
                          (m.author === username && (
                            <p style={{ color: 'blue' }}>
                              {`${m.author}: ${m.message}`}
                            </p>
                          )) || (m.author !== username && (
                            <p style={{ color: 'green' }}>
                              {`${m.author}: ${m.message}`}
                            </p>
                          ))
                        ))}
                        <Messages _id={chatroom._id} />
                      </p>
                    </div>
                  </div>
                  ))).reverse()}
              </div>
            </div>

            <div className="modal fade" id="Create" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Create a New Chatroom!</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Roomname:</label>
                        <input className="form-control" onChange={e => setRoomname(e.target.value)} />
                        <label>Room Password (Optional):</label>
                        <input className="form-control" onChange={e => setRoompass(e.target.value)} />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button className="btn btn-primary" data-dismiss="modal" onClick={() => create()}>Create</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="Join" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Join a Private Chatroom</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Roomname:</label>
                        <input className="form-control" onChange={e => setJoinRoom(e.target.value)} />
                        <label>Room Password:</label>
                        <input className="form-control" onChange={e => setJoinPass(e.target.value)} />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button className="btn btn-primary" data-dismiss="modal" onClick={() => join()}>Join</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      {!loggedIn
        && (
        <>
          <button className="btn float-right" onClick={() => navigate('/login')}>Login</button>
          <button className="btn float-right" onClick={() => navigate('/signup')}>Signup</button>
          <h3>Public Chatrooms</h3>
          <br />
          <br />
          <div className="row">
            <div className="col">
              <h3>Chatrooms</h3>
              {chatrooms.map(chatroom => (
                (!chatroom.password) && (
                  <div className="card">
                    <button
                      className="btn"
                      onClick={() => {
                        setSelected(chatroom._id)
                      }}
                    >
                      {`Room Name: ${chatroom.roomname}`}
                      <br />
                      {`Admin: ${chatroom.admin}`}
                      <br />
                      {chatroom.password && (
                      <>
                        {`Users: ${chatroom.users}`}
                      </>
                      )}
                    </button>
                  </div>
                ))).reverse()}
            </div>
            <div className="col-9">
              {chatrooms.filter(u => u._id === selected).map(chatroom => (
                (!chatroom.password) && (
                  <div className="card">
                    <p>
                      {`Room Name: ${chatroom.roomname}`}
                      <br />
                      {`Admin: ${chatroom.admin}`}
                      <br />
                      {chatroom.password && (
                      <>
                        Users:
                        <br />
                        {chatroom.users}
                      </>
                      )}
                    </p>
                    <p>
                      {chatroom.messages.map(m => (
                        <>
                          {`${m.author}: ${m.message}`}
                          <br />
                        </>
                      ))}
                    </p>
                  </div>
                ))).reverse()}
            </div>
          </div>
        </>
        )}
    </div>
  )
}

function Signup({
  username, password, setUsername, setPassword, navigate, loggedIn,
}) {
  if (loggedIn) {
    navigate('/')
  }
  const createUser = async () => {
    try {
      const asd = await axios.post('/account/signup', { username, password })
      if (asd.data === 'user creation failed') {
        throw new Error('user creation failed')
      }
      navigate('/')
    } catch (e) {
      console.log(e)
      alert('user signup failed')
    }
  }

  return (
    <div className="container">
      <button className="btn" onClick={() => navigate('/')}>Home</button>
      <h2>Signup</h2>
      <label>Username</label>
      <br />
      <input onChange={e => setUsername(e.target.value)} />
      <br />
      <label>Password</label>
      <br />
      <input onChange={e => setPassword(e.target.value)} />
      <br />
      <button
        className="btn btn-primary"
        onClick={() => {
          createUser()
        }}
      >
        Submit
      </button>
      <br />
      <p>
        {`Already have an account? `}
        <Link to="/login">Log in here!</Link>
      </p>
    </div>
  )
}

function Login({
  username, password, setUsername, setPassword, navigate, loggedIn,
}) {
  if (loggedIn) {
    navigate('/')
  }
  const login = async () => {
    try {
      const asd = await axios.post('/account/login', { username, password })
      if (asd.data === 'username or password is incorrect') {
        throw new Error('username or password is incorrect')
      }
      navigate('/')
    } catch (e) {
      console.log(e)
      alert('user authentification failed')
    }
  }
  return (
    <div className="container">
      <button className="btn" onClick={() => navigate('/')}>Home</button>
      <h2>Login</h2>
      <label>Username</label>
      <br />
      <input onChange={e => setUsername(e.target.value)} />
      <br />
      <label>Password</label>
      <br />
      <input onChange={e => setPassword(e.target.value)} />
      <br />
      <button className="btn btn-primary" onClick={() => login()}> Submit </button>
      <br />
      <p>
        {`Don't have an account? `}
        <Link to="/signup">Sign up!</Link>
      </p>
    </div>
  )
}

function Messages(_id) {
  const [message, setMessage] = useState([])
  const sendMessage = async () => {
    try {
      const asd = await axios.post('/api/chatroom/message', { _id, message })
      if (asd.data === 'answer failed to submit') {
        throw new Error('answer failed to submit')
      }
    } catch (error) {
      console.log(error)
      alert('answer failed to submit')
    }
  }
  return (
    <div>
      <textarea className="form-control" id="message" rows="2" onChange={e => setMessage(e.target.value)} />
      <br />
      <button
        className="btn btn-primary float-right"
        onClick={() => {
          sendMessage()
          document.getElementById('message').value = ''
        }}
      >
        Send
      </button>
    </div>
  )
}

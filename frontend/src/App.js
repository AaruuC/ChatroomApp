/* eslint-disable linebreak-style */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Routes, Route, Outlet, Link, useNavigate,
} from 'react-router-dom'

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const intervalID = setInterval(() => {
      const getQuestions = async () => {
        const { data } = await axios.get('api/questions')
        console.log(data)
        setQuestions(data)
        // console.log(questions)
      }

      getQuestions()
      const check = async () => {
        const user = await axios.get('/account/logged')
        // setLoggedIn(user)
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
    // setLoggedIn(user)
    if (user.data == null || user.data === '') {
      setLoggedIn(false)
    } else {
      setUsername(user.data)
      setLoggedIn(true)
    }
  }
  check()

  const logout = async () => {
    const asd = await axios.post('/account/logout')
    setLoggedIn(false)
  }
  // useEffect(() => {
  //   const getUsers = async () => {
  //     // const users = await axios
  //   }
  // }, [])

  const navigate = useNavigate()

  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Layout loggedIn={loggedIn} />}> */}
        <Route path="/" element={<Home username={username} password={password} setLoggedIn={setLoggedIn} loggedIn={loggedIn} navigate={navigate} logout={logout} questions={questions} />} />
        <Route path="signup" element={<Signup username={username} password={password} setUsername={setUsername} setPassword={setPassword} navigate={navigate} loggedIn={loggedIn} />} />
        <Route path="login" element={<Login username={username} password={password} setUsername={setUsername} setPassword={setPassword} navigate={navigate} loggedIn={loggedIn} />} />
        {/* </Route> */}
      </Routes>
    </div>
  )
}

function Layout(loggedIn) {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!loggedIn && (
            <>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
          {/* <li>
            <Link to="/signup">Signup</Link>
          </li> */}
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  )
}

function Home({
  username, password, loggedIn, setLoggedIn, navigate, logout, questions,
}) {
  const [questionText, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const ask = async () => {
    try {
      const asd = await axios.post('/api/questions/add', { questionText })
      if (asd.data === 'question failed to submit') {
        throw new Error('question failed to submit')
      }
    } catch (error) {
      console.log(error)
      alert('question failed to submit')
    }
  }

  // const answerQuestion = async _id => {
  //   try {
  //     const asd = await axios.post('/api/questions/answer', { _id, answer })
  //     if (asd.data === 'answer failed to submit') {
  //       throw new Error('answer failed to submit')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     alert('answer failed to submit')
  //   }
  // }

  return (
    <div className="container">
      <h2>Scuffed Campuswire</h2>
      {loggedIn
        && (
          <>
            <div className="container">
              <h1>
                {`Hello ${username}`}
              </h1>
              <button className="btn btn-outline-danger float-right" onClick={() => logout()}>Logout</button>
            </div>
            <br />
            <button type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target="#exampleModal">
              Add New Question
            </button>

            {questions.map(question => (
              <div className="card">
                <p>
                  {`Question: `}
                  <br />
                  {question.questionText}
                </p>
                <p>
                  {`Author: `}
                  <br />
                  {question.author}
                </p>
                <p>
                  {`Answer: `}
                  <br />
                  {question.answer}
                </p>
                {/* <Answer _id={question._id} /> */}
              </div>
            )).reverse()}

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add a Question</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Question:</label>
                        <textarea className="form-control" rows="3" onChange={e => setQuestion(e.target.value)} />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button className="btn btn-primary" data-dismiss="modal" onClick={() => ask()}>Submit</button>
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
          <br />
          <br />
          {questions.map(question => (
            <div className="card">
              <p>
                {`Question: `}
                <br />
                {question.questionText}
              </p>
              <p>
                {`Author: `}
                <br />
                {question.author}
              </p>
              <p>
                {`Answer: `}
                <br />
                {question.answer}
              </p>
            </div>
          )).reverse()}
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
      // console.log(asd)
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

// function Answer(_id) {
//   const [answer, setAnswer] = useState('')
//   const answerQuestion = async () => {
//     try {
//       const asd = await axios.post('/api/questions/answer', { _id, answer })
//       if (asd.data === 'answer failed to submit') {
//         throw new Error('answer failed to submit')
//       }
//     } catch (error) {
//       console.log(error)
//       alert('answer failed to submit')
//     }
//   }
//   return (
//     <div>
//       <label>Answer this question</label>
//       <br />
//       <textarea className="form-control" rows="2" onChange={e => setAnswer(e.target.value)} />
//       <br />
//       <button className="btn btn-primary" onClick={() => answerQuestion()}>Answer</button>
//     </div>
//   )
// }

/* eslint-disable linebreak-style */
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
// import reactDom from "react-dom"
import { App } from './App'

const app = document.getElementById('app')
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>, app,
)

// const root = createRoot(app)
// root.render(
//   <React.StrictMode />,
// )
// createRoot(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>,
//   app,
// )

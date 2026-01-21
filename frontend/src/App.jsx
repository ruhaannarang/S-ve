import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
function App() {
  const router=createBrowserRouter([
    {path:"/home",
      element:<><Home/></>
    },
    {path:"/signup",
      element:<><SignUp/></>
    },
    {path:"/login",
      element:<><Login/></>
    }
  ])

  return (
    <>
    <RouterProvider router={router}/>
     
    </>
  )
}

export default App

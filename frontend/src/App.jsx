import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Home from './components/Home';
function App() {
  const router=createBrowserRouter([
    {path:"/home",
      element:<><Home/></>
    },
    {path:"/signup",
      element:<><SignUp/></>
    }
  ])

  return (
    <>
    <RouterProvider router={router}/>
     
    </>
  )
}

export default App

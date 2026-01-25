import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Feed from './components/Feed';
import AddPost from './components/AddPost';
function App() {
  const router=createBrowserRouter([
    {path:"/",
      element:<><Home/></>
    },
    {path:"/home",
      element:<><Home/></>
    },
    {path:"/signup",
      element:<><SignUp/></>
    },
    {path:"/login",
      element:<><Login/></>
    },
    {path:"/feed",
      element:<><Feed/></>
    },
    {path:"/addpost",
      element:<><AddPost/></>
    },
  ])

  return (
    <>
    <RouterProvider router={router}/>
     
    </>
  )
}

export default App

import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import { useAuth } from '@clerk/clerk-react'
import {Toaster} from 'react-hot-toast'


// Main App component: Sets up authentication and routing for the application
const App = () => {

  // ADDED THIS CODE FOR DEBUGGING
  // // Get the getToken function from Clerk for authentication
  // const { getToken } = useAuth()
  // // On mount, fetch and log the user's JWT token (for debugging/API calls)
  // useEffect(()=> {
  //     getToken().then((token) => console.log(token))
  //   },[])

  return (
    <div>
      <Toaster />
      {/* Define all application routes using React Router */}
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* Nested routes for /ai section, using Layout as a wrapper */}
        <Route path='/ai' element={<Layout/>} >
          <Route index element={<Dashboard/>} />
          <Route path='write-article' element={<WriteArticle/>} />
          <Route path='blog-titles' element={<BlogTitles/>} />
          <Route path='generate-images' element={<GenerateImages/>} />
          <Route path='remove-background' element={<RemoveBackground/>} />
          <Route path='remove-object' element={<RemoveObject/>} />
          <Route path='review-resume' element={<ReviewResume/>} />
          <Route path='community' element={<Community/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
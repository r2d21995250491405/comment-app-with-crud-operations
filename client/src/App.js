
import { Route, Routes } from 'react-router-dom';
import './App.css';
import './styles.css';
import { PostLists } from './components/PostList';
import { PostProvider } from './context/PostContext';
import { Post } from './components/Post';


function App() {

  return (<div className='container'>
    <Routes>
      <Route path='/' element={<PostLists />} />
      <Route path='posts/:id' element={
        <PostProvider>
          <Post />
        </PostProvider>
      } />
    </Routes>
  </div>)


}

export default App;

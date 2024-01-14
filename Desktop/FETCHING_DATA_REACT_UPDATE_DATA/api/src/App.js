import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import logo from './images/logo.png';

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    fetch('http://localhost:3005/posts')
      .then(resp => resp.json())
      .then(json => {
        console.log(json);
        setData(json);
      })
  }, []);

  const handleAddData = async () => {
    try {
      const existingPost = data.find(post => post.title === title || post.body === body || post.tags === hash);

      if (existingPost) {
        const updatedPost = {
          ...existingPost,
          title: title !== '' ? title : existingPost.title,
          body: body !== '' ? body : existingPost.body,
          tags: hash !== '' ? hash : existingPost.tags,
        };
        const response = await fetch(`http://localhost:3005/posts/${existingPost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPost),
        });
        const updatedData = await response.json();
        setData(data.map(post => (post.id === existingPost.id ? updatedData : post)));
      } else {
        const newPost = {
          title: title,
          body: body,
          tags: hash,
        };
        const response = await fetch('http://localhost:3005/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        });
        const updatedData = await response.json();
        setData([...data, updatedData]);
      }
      setTitle('');
      setBody('');
      setHash('');
    } catch (error) {
      console.error('Error adding/updating data:', error);
    }
  };


  return (
    <div style={{background:'linear-gradient(to bottom, grey, blue, green)'}}>
      {/* Navbar */}
      <div className='navbar'>
        <div className='container'>
          <div className='navbar-brand'>
            <img src={logo} width={'125px'} alt='logo' />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className='hero'>
        <div className='container'>
          <div className='hero-text'>
            <div className='display-6 text-center fw-bold'>Fetching and updating the data in an API</div>
          </div>
          <div className='value-input text-center d-flex mt-3'>
            <input className='form-control w-25 mx-auto mt-3' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' />
            <button className='btn btn-primary mt-3 ms-3 me-3' onClick={handleAddData}>Add Title</button>
            <input className='form-control w-25 mx-auto mt-3' value={body} onChange={(e) => setBody(e.target.value)} placeholder='Body' />
            <button className='btn btn-primary mt-3 ms-3 me-3' onClick={handleAddData}>Add Words</button>
          </div>
        </div>
      </div>

      {/* showcasing the cards */}
      <div className='output mt-5'>
        <div className='container'>
          <div className='row'>
            {data.map((x) => (
              <div className='col' key={x.id}>
                <Card className='m-3' style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>{x.id}. {x.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">#{x.tags}</Card.Subtitle>
                    <Card.Text>
                      {x.body}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
          <div className='bottom-text display-5 fw-bold fst-italic text-center pt-5 pb-3'>&copy; Project By Auroskkil - www.auroskkil.com</div>
        </div>
      </div>
    </div>
  )
}

export default App;

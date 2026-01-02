// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import {
//   Typography, Container, TextField, Button, Card,
//   CardContent, CardActions, Box
// } from '@mui/material';

// /**
//  * Dashboard page (protected). Shows user info and handles CRUD for posts.
//  */
// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const [posts, setPosts] = useState([]);
//   const [title, setTitle] = useState('');       // For new post / editing
//   const [content, setContent] = useState('');
//   const [editingId, setEditingId] = useState(null);

//   // Fetch posts on mount
//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const res = await api.get('/posts');
//       setPosts(res.data);
//     } catch (err) {
//       console.error("Error fetching posts", err);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editingId) {
//         // Update existing post
//         await api.put(`/posts/${editingId}`, { title, content });
//       } else {
//         // Create new post
//         await api.post('/posts', { title, content });
//       }
//       setTitle(''); setContent(''); setEditingId(null);
//       fetchPosts();
//     } catch (err) {
//       console.error("Error saving post", err);
//     }
//   };

//   const handleEdit = (post) => {
//     setEditingId(post._id);
//     setTitle(post.title);
//     setContent(post.content);
//   };

//   const handleDelete = async (id) => {
//     await api.delete(`/posts/${id}`);
//     fetchPosts();
//   };

//   return (
//     <Container className="mt-10">
//       <Box className="flex justify-between items-center mb-6">
//         <Typography variant="h5">Hello, {user?.name}!</Typography>
//         <Button variant="outlined" color="secondary" onClick={logout}>Logout</Button>
//       </Box>

//       <Typography variant="h6" gutterBottom>
//         {editingId ? "Edit Post" : "New Post"}
//       </Typography>
//       <Box className="flex flex-col md:flex-row gap-4 mb-6">
//         <TextField
//           label="Title" variant="outlined" value={title}
//           onChange={e => setTitle(e.target.value)} className="flex-1" />
//         <TextField
//           label="Content" variant="outlined" value={content}
//           onChange={e => setContent(e.target.value)} className="flex-2" />
//         <Button
//           variant="contained" color="primary"
//           onClick={handleSubmit}
//           className="self-end"
//         >
//           {editingId ? "Update" : "Create"}
//         </Button>
//       </Box>

//       <Typography variant="h6" gutterBottom>Your Posts</Typography>
//       <Box className="grid gap-4">
//         {posts.map(post => (
//           <Card key={post._id} className="border">
//             <CardContent>
//               <Typography variant="h6">{post.title}</Typography>
//               <Typography variant="body2" color="textSecondary">{post.content}</Typography>
//             </CardContent>
//             <CardActions>
//               <Button size="small" onClick={() => handleEdit(post)}>Edit</Button>
//               <Button size="small" color="secondary" onClick={() => handleDelete(post._id)}>
//                 Delete
//               </Button>
//             </CardActions>
//           </Card>
//         ))}
//       </Box>
//     </Container>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { LogOut, Edit2, Trash2, Plus } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/posts/${editingId}`, { title, content });
      } else {
        await api.post("/posts", { title, content });
      }
      setTitle("");
      setContent("");
      setEditingId(null);
      fetchPosts();
    } catch (err) {
      console.error("Error saving post", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
        fetchPosts();
        setTitle("");
        setContent("");
        setEditingId(null); 
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {user?.name || "User"}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Create / Edit Post */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Post" : "Create New Post"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              placeholder="Post content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-70"
            >
              <Plus size={16} />
              {editingId ? "Update Post" : "Create Post"}
            </button>
          </form>
        </div>

        {/* Posts */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Your Posts
          </h2>

          {posts.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-gray-500">
              No posts yet. Create your first post.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-white p-5 rounded-xl shadow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.content}</p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

function DashboardTeacher() {
  const [lessons, setLessons] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: '', content: '' });
  const [newExercise, setNewExercise] = useState({ title: '', description: '', lesson_id: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const lessonsRes = await axios.get('/lessons');
      const exercisesRes = await axios.get('/exercises');
      setLessons(lessonsRes.data);
      setExercises(exercisesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/lessons', newLesson);
      setNewLesson({ title: '', content: '' });
      fetchData();
    } catch (err) {
      console.error('Error creating lesson:', err);
    }
    setLoading(false);
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/exercises', newExercise);
      setNewExercise({ title: '', description: '', lesson_id: '' });
      fetchData();
    } catch (err) {
      console.error('Error creating exercise:', err);
    }
    setLoading(false);
  };

  const handleDeleteLesson = async (id) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await axios.delete(`/lessons/${id}`);
        fetchData();
      } catch (err) {
        console.error('Error deleting lesson:', err);
      }
    }
  };

  const handleDeleteExercise = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await axios.delete(`/exercises/${id}`);
        fetchData();
      } catch (err) {
        console.error('Error deleting exercise:', err);
      }
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Teacher Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </header>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2>Create New Lesson</h2>
          <form onSubmit={handleCreateLesson} style={styles.form}>
            <input
              type="text"
              placeholder="Lesson Title"
              value={newLesson.title}
              onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Lesson Content"
              value={newLesson.content}
              onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
              style={styles.textarea}
              required
            />
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Creating...' : 'Create Lesson'}
            </button>
          </form>
        </div>

        <div style={styles.section}>
          <h2>Create New Exercise</h2>
          <form onSubmit={handleCreateExercise} style={styles.form}>
            <input
              type="text"
              placeholder="Exercise Title"
              value={newExercise.title}
              onChange={(e) => setNewExercise({...newExercise, title: e.target.value})}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Exercise Description"
              value={newExercise.description}
              onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}
              style={styles.textarea}
              required
            />
            <select
              value={newExercise.lesson_id}
              onChange={(e) => setNewExercise({...newExercise, lesson_id: e.target.value})}
              style={styles.input}
              required
            >
              <option value="">Select Lesson</option>
              {lessons.map(lesson => (
                <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
              ))}
            </select>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Creating...' : 'Create Exercise'}
            </button>
          </form>
        </div>

        <div style={styles.section}>
          <h2>My Lessons</h2>
          {lessons.map(lesson => (
            <div key={lesson.id} style={styles.card}>
              <h3>{lesson.title}</h3>
              <p>{lesson.content.substring(0, 100)}...</p>
              <button
                onClick={() => handleDeleteLesson(lesson.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h2>My Exercises</h2>
          {exercises.map(exercise => (
            <div key={exercise.id} style={styles.card}>
              <h3>{exercise.title}</h3>
              <p>{exercise.description.substring(0, 100)}...</p>
              <button
                onClick={() => handleDeleteExercise(exercise.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  content: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  section: {
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical'
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem'
  }
};

export default DashboardTeacher;
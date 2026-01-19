import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

function DashboardStudent() {
  const [lessons, setLessons] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonExercises, setLessonExercises] = useState([]);
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

  const handleViewLesson = async (lessonId) => {
    try {
      const response = await axios.get(`/lessons/${lessonId}`);
      setSelectedLesson(response.data);
      
      const exercisesRes = await axios.get(`/lessons/${lessonId}/exercises`);
      setLessonExercises(exercisesRes.data);
    } catch (err) {
      console.error('Error fetching lesson details:', err);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Student Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </header>

      <div style={styles.content}>
        {selectedLesson ? (
          <div>
            <button onClick={() => setSelectedLesson(null)} style={styles.backButton}>
              Back to Lessons
            </button>
            <div style={styles.section}>
              <h2>{selectedLesson.title}</h2>
              <p style={styles.contentText}>{selectedLesson.content}</p>
              <p><strong>Teacher:</strong> {selectedLesson.teacher?.name}</p>
            </div>

            <div style={styles.section}>
              <h3>Exercises for this Lesson</h3>
              {lessonExercises.map(exercise => (
                <div key={exercise.id} style={styles.card}>
                  <h4>{exercise.title}</h4>
                  <p>{exercise.description}</p>
                  {exercise.solution && (
                    <div style={styles.solution}>
                      <strong>Solution:</strong>
                      <p>{exercise.solution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={styles.section}>
              <h2>Available Lessons</h2>
              {lessons.map(lesson => (
                <div key={lesson.id} style={styles.card} onClick={() => handleViewLesson(lesson.id)} >
                  <h3>{lesson.title}</h3>
                  <p>{lesson.content.substring(0, 150)}...</p>
                  <p><strong>By:</strong> {lesson.teacher?.name}</p>
                </div>
              ))}
            </div>

            <div style={styles.section}>
              <h2>All Exercises</h2>
              {exercises.map(exercise => (
                <div key={exercise.id} style={styles.card}>
                  <h3>{exercise.title}</h3>
                  <p>{exercise.description.substring(0, 100)}...</p>
                  <p><strong>Lesson:</strong> {exercise.lesson?.title}</p>
                  <p><strong>Teacher:</strong> {exercise.teacher?.name}</p>
                </div>
              ))}
            </div>
          </>
        )}
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
    backgroundColor: '#6c757d',
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
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem'
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
  card: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  contentText: {
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
  },
  solution: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#e8f5e8',
    borderRadius: '4px',
    borderLeft: '4px solid #28a745'
  }
};

export default DashboardStudent;
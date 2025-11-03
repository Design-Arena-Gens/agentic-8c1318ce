import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [days, setDays] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSchedule = async (e) => {
    e.preventDefault();

    if (!topic.trim() || !days || days < 1) {
      alert('Please enter a valid topic and number of days');
      return;
    }

    setLoading(true);
    setSchedule(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, days: parseInt(days) }),
      });

      const data = await response.json();
      setSchedule(data.schedule);
    } catch (error) {
      alert('Error generating schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTopic('');
    setDays('');
    setSchedule(null);
  };

  return (
    <>
      <Head>
        <title>Learning Schedule Generator</title>
        <meta name="description" content="Generate personalized learning schedules" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <header>
          <h1>📚 Learning Schedule Generator</h1>
          <p>Create a personalized learning plan for any topic</p>
        </header>

        <main>
          {!schedule ? (
            <form onSubmit={generateSchedule}>
              <div className="form-group">
                <label htmlFor="topic">What do you want to learn?</label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., JavaScript, Python, Guitar, Spanish"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="days">How many days do you have?</label>
                <input
                  id="days"
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="e.g., 30"
                  min="1"
                  max="365"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Generating...' : 'Generate Schedule'}
              </button>
            </form>
          ) : (
            <div className="schedule-container">
              <div className="schedule-header">
                <h2>Your Learning Schedule</h2>
                <button onClick={resetForm} className="btn-secondary">
                  Create New Schedule
                </button>
              </div>

              <div className="schedule-info">
                <div className="info-item">
                  <strong>Topic:</strong> {schedule.topic}
                </div>
                <div className="info-item">
                  <strong>Duration:</strong> {schedule.totalDays} days
                </div>
              </div>

              <div className="schedule-timeline">
                {schedule.days.map((day, index) => (
                  <div key={index} className="day-card">
                    <div className="day-number">Day {day.day}</div>
                    <h3>{day.title}</h3>
                    <p className="day-description">{day.description}</p>
                    <div className="activities">
                      <h4>Activities:</h4>
                      <ul>
                        {day.activities.map((activity, i) => (
                          <li key={i}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="duration">⏱️ {day.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer>
          <p>Built with Next.js • Start learning today! 🚀</p>
        </footer>
      </div>
    </>
  );
}

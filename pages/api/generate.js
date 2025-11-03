export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, days } = req.body;

  if (!topic || !days || days < 1 || days > 365) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const schedule = generateLearningSchedule(topic, days);

  res.status(200).json({ schedule });
}

function generateLearningSchedule(topic, totalDays) {
  const learningPhases = {
    introduction: Math.ceil(totalDays * 0.2),
    fundamentals: Math.ceil(totalDays * 0.3),
    intermediate: Math.ceil(totalDays * 0.3),
    advanced: Math.ceil(totalDays * 0.2)
  };

  const scheduleData = {
    topic,
    totalDays,
    days: []
  };

  let currentDay = 1;

  // Introduction Phase
  for (let i = 0; i < learningPhases.introduction; i++) {
    scheduleData.days.push({
      day: currentDay++,
      phase: 'Introduction',
      title: `Getting Started with ${topic}`,
      description: i === 0
        ? `Understand what ${topic} is and why it matters. Get familiar with basic concepts and terminology.`
        : `Continue exploring foundational concepts. Set up your learning environment and gather resources.`,
      activities: [
        `Watch introductory videos about ${topic}`,
        'Read beginner-friendly articles or documentation',
        'Join online communities or forums',
        'Set clear learning goals'
      ],
      duration: '1-2 hours'
    });
  }

  // Fundamentals Phase
  for (let i = 0; i < learningPhases.fundamentals; i++) {
    const dayInPhase = i + 1;
    scheduleData.days.push({
      day: currentDay++,
      phase: 'Fundamentals',
      title: `Core Concepts ${dayInPhase}`,
      description: `Master fundamental skills in ${topic}. Focus on building a strong foundation through practice and repetition.`,
      activities: [
        'Study core principles and techniques',
        'Complete beginner exercises or tutorials',
        'Take notes and create summaries',
        'Practice what you learned for 30 minutes'
      ],
      duration: '2-3 hours'
    });
  }

  // Intermediate Phase
  for (let i = 0; i < learningPhases.intermediate; i++) {
    const dayInPhase = i + 1;
    scheduleData.days.push({
      day: currentDay++,
      phase: 'Intermediate',
      title: `Building Skills ${dayInPhase}`,
      description: `Apply your knowledge to real-world scenarios. Start working on small projects or challenges.`,
      activities: [
        'Work on a hands-on project',
        'Learn intermediate techniques',
        'Study examples from experienced practitioners',
        'Review and reinforce previous concepts'
      ],
      duration: '2-4 hours'
    });
  }

  // Advanced Phase
  for (let i = 0; i < learningPhases.advanced; i++) {
    const dayInPhase = i + 1;
    scheduleData.days.push({
      day: currentDay++,
      phase: 'Advanced',
      title: `Advanced Practice ${dayInPhase}`,
      description: `Challenge yourself with complex problems. Refine your skills and develop your unique style.`,
      activities: [
        'Tackle challenging projects or problems',
        'Explore advanced topics and best practices',
        'Get feedback from the community',
        'Create something original'
      ],
      duration: '3-4 hours'
    });
  }

  // Add review/consolidation days if schedule is long enough
  if (totalDays >= 7) {
    const reviewInterval = Math.floor(totalDays / 7);
    for (let i = reviewInterval; i < totalDays; i += reviewInterval) {
      if (scheduleData.days[i]) {
        scheduleData.days[i].activities.push('📝 Review all concepts learned so far');
      }
    }
  }

  return scheduleData;
}

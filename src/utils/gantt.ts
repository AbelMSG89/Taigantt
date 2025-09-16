import type { UserStory } from '@/features/user_stories/models/user-stories';
import type { Milestone } from '@/features/milestones/models/milestones';
import { GANTT_CONFIG } from '@/constants/gantt';

export const formatUserStoryForGantt = (userStory: UserStory) => {
  const today = new Date().toISOString().split('T')[0];
  const startDate = userStory.created_date ? userStory.created_date.split('T')[0] : today;
  const endDate = userStory.due_date || userStory.finish_date || today;
  
  return {
    id: userStory.id.toString(),
    name: userStory.subject,
    start: startDate,
    end: endDate,
    progress: userStory.is_closed ? 100 : 0,
    dependencies: '',
    custom_class: userStory.is_closed ? 'completed' : 'pending'
  };
};

export const calculateGanttDates = (milestone: Milestone) => {
  if (!milestone.user_stories || milestone.user_stories.length === 0) {
    return {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    };
  }

  const dates = milestone.user_stories
    .filter(story => story.created_date || story.due_date)
    .map(story => ({
      start: new Date(story.created_date),
      end: new Date(story.due_date || story.finish_date || story.created_date)
    }));

  if (dates.length === 0) {
    return {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    };
  }

  const startDate = new Date(Math.min(...dates.map(d => d.start.getTime())));
  const endDate = new Date(Math.max(...dates.map(d => d.end.getTime())));

  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0]
  };
};

export const getGanttConfig = () => ({
  ...GANTT_CONFIG
});
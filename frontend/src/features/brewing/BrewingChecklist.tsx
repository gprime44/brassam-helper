import React from 'react';
import { useTranslation } from 'react-i18next';
import { brewingApi, BrewingTask } from '../../services/api';

interface BrewingChecklistProps {
  tasks: BrewingTask[];
  onTaskToggle: (taskId: number) => void;
}

const BrewingChecklist: React.FC<BrewingChecklistProps> = ({ tasks, onTaskToggle }) => {
  const { t } = useTranslation();

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, BrewingTask[]>);

  return (
    <div className="brewing-checklist">
      {Object.entries(groupedTasks).map(([category, catTasks]) => (
        <section key={category} className="checklist-category">
          <h3>{category}</h3>
          <ul className="task-list">
            {catTasks.sort((a, b) => a.orderIndex - b.orderIndex).map(task => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => onTaskToggle(task.id)} 
                  />
                  <span>{task.label}</span>
                  {task.duration && <span className="duration">{task.duration} min</span>}
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default BrewingChecklist;

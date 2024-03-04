// GanttHelper.tsx
import { Task } from '../../types/public-types';

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Benson Weir",
      id: "BensonWeir",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      name: "Benson Weir Design",
      id: "BensonDesign",
      progress: 45,
      type: "task",
      project: "BensonWeir",
      displayOrder: 2,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Benson Weir Feasibility",
      id: "BensonFeasibility",
      progress: 25,
      dependencies: ["BensonDesign"],
      type: "task",
      project: "BensonWeir",
      displayOrder: 3,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Benson Weir Construction",
      id: "BensonConstruction",
      progress: 10,
      dependencies: ["BensonDesign", "BensonFeasibility"],
      type: "task",
      project: "BensonWeir",
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Old Windsor",
      id: "OldWindsor",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      name: "Old Windsor Design",
      id: "OWDesign",
      progress: 45,
      type: "task",
      project: "OldWindsor",
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Old Windsor Feasibility",
      id: "OWFeasibility",
      progress: 25,
      dependencies: ["OWDesign"],
      type: "task",
      project: "OldWindsor",
      displayOrder: 8,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Old Windsor Construction",
      id: "OWConstruction",
      progress: 10,
      dependencies: ["OWFeasibility"],
      type: "task",
      project: "OldWindsor",
      displayOrder: 9,
    },
  ];
  return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string): [Date, Date] | [] {
  const projectTasks = tasks.filter(t => t.project === projectId);
  if (projectTasks.length === 0) {
    // Return an empty tuple if no tasks match the project ID
    return [];
  }

  let start: Date = projectTasks[0].start;
  let end: Date = projectTasks[0].end;

  for (let i = 1; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}

import React from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { getStartEndDateForProject } from "../components/gantt_scripts/GanttHelper";
import { ViewSwitcher } from '../components/gantt_scripts/view-switcher';
import { useData } from '../contexts/useDataContext';

import { useCallback, useState } from "react";
import { CgArrowsExpandUpRight } from "react-icons/cg";
import Modal from "../components/gantt_scripts/GanttModal";
import SubTaskModal from '../components/gantt_scripts/SubTaskModal';
import CustomColumn from '../components/gantt_scripts/GanttColumn';
import { Button } from 'react-bootstrap';

const MyGanttChart = () => {

    const { view, setView } = useData()
    const { tasks, setTasks } = useData()
    const { isChecked, setIsChecked} = useData()
    const { isGanttOpen, setIsGanttOpen } = useData()

    const [selectedTask, setSelectedTask] = useState(null)

    const handleDisplayModal = useCallback(() => {
      setIsGanttOpen((prev) => (prev = !prev));
    }, []);

    const { isSubTaskOpen, setIsSubTaskOpen } = useData();
    const handleSubTaskModal = useCallback(() => {
      setIsSubTaskOpen((prev) => (prev = !prev));
    }, []);

    const handleSelectTask = useCallback((task) => {
      setSelectedTask(task);
    }, []);
  
    let columnWidth = 65;
    
    if (view === ViewMode.Year) {
    columnWidth = 350;
    } else if (view === ViewMode.Month) {
    columnWidth = 300;
    } else if (view === ViewMode.Week) {
    columnWidth = 250;
    }

    const handleTaskChange = (task: Task) => {
        console.log("On date change Id:" + task.id);
        let newTasks = tasks.map(t => (t.id === task.id ? task : t));
        if (task.project) {
          const dates = getStartEndDateForProject(newTasks, task.project);

          if (dates.length === 0) {
            console.log("Bro something went wrong with updating Gantt chart dates")
          } else {

            const [start, end] = dates;
            const project = newTasks[newTasks.findIndex(t => t.id === task.project)];

            if (
              project.start.getTime() !== start.getTime() ||
              project.end.getTime() !== end.getTime()
            ) {
              const changedProject = { ...project, start, end };
              newTasks = newTasks.map(t =>
                t.id === task.project ? changedProject : t
              );
            }
          }
        }
        setTasks(newTasks);
      };
    
      const handleTaskDelete = (task: Task) => {
        const conf = window.confirm("Are you sure about " + task.name + " ?");
        if (conf) {
          setTasks(tasks.filter(t => t.id !== task.id));
        }
        return conf;
      };
    
      const handleProgressChange = (task: Task) => {
        setTasks(tasks.map(t => (t.id === task.id ? task : t)));
        console.log("On progress change Id:" + task.id);
      };
    
      const handleDblClick = (task: Task) => {
        alert("On Double Click event Id:" + task.id);
      };
    
      const handleClick = (task: Task) => {
        console.log("On Click event Id:" + task.id);
      };
    
      const handleSelect = (task: Task, isSelected: boolean) => {
        console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
      };
    
      const handleExpanderClick = (task: Task) => {
        setTasks(tasks.map(t => (t.id === task.id ? task : t)));
        console.log("On expander click Id:" + task.id);
      };

      return (
        <div>
          <ViewSwitcher
            onViewModeChange={viewMode => setView(viewMode)}
            onViewListChange={setIsChecked}
            isChecked={isChecked}
          />

          <Button onClick={handleDisplayModal}>Add Weir Project</Button>
          {isGanttOpen && <Modal handleDisplayModal={handleDisplayModal} />}
          {isSubTaskOpen && 
            <SubTaskModal 
              handleSubTaskModal={handleSubTaskModal}
              task={selectedTask}
            />}

          <div style={{ display: 'flex', flexDirection: 'row' }}>

          <CustomColumn 
            tasks={tasks}
            onSelectTask={handleSelectTask}
          />
          <Gantt
            tasks={tasks}
            viewMode={view}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onProgressChange={handleProgressChange}
            onDoubleClick={handleDblClick}
            onClick={handleClick}
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? "155px" : ""}
            columnWidth={columnWidth}
          />
          </div>
        </div>
      );
    };
    
export default MyGanttChart;
  
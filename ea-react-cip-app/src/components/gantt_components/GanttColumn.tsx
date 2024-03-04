import React from 'react';
import { useCallback } from "react";
import '../../styles/ganttStyles.css';
import { Button } from 'react-bootstrap';
import { useData } from '../../contexts/useDataContext';
import { ExtendGanttProps, Task } from '../../types/public-types';

export const CustomColumn: React.FC<ExtendGanttProps> = ({ tasks, onSelectTask }) => {
    const { setIsSubTaskOpen } = useData();

    const handleSubTaskModal = useCallback(() => {
        setIsSubTaskOpen(prev => !prev);
    }, [setIsSubTaskOpen]);

    const onAddSubTaskClick = (task: Task) => {
        handleSubTaskModal();
        onSelectTask(task);
    };

    return (
        <div className="custom-column">
            <div className="custom-column-row"></div>
            {tasks.map(task => (
                <div key={task.id} className="custom-column-row">
                    {
                        task.type === "project" ? (
                            <Button onClick={() => onAddSubTaskClick(task)}>Add Sub-Tasks</Button>
                        ) : (
                            <p></p>
                        )
                    }
                </div>
            ))}
        </div>
    );
};

export default CustomColumn;

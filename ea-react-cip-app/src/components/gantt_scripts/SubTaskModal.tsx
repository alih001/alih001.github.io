import React, { useState } from 'react';
import { styled } from "styled-components";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Button } from 'react-bootstrap';
import { useData } from '../../contexts/useDataContext';
import Select from 'react-select'

import { Task, SubTaskModalProps } from '../../types/public-types';

export const Label = styled.label`
  font-size: 1rem;
  font-weight: thin;
  align-self: flex-start;
  color: #36454f;
`;

export const HorizontalDivider = styled.div`
  width: 100%;
  height: 2px;
  background-color: #36454F;
`;

export const Input = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  &:focus {
    outline: 1px solid #36454F;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 8px;
`;

const ModalContainer = styled.article`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContentContainer = styled.div`
  background-color: white;
  position: relative;
  width: 30%;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  z-index: 1001;
`;

const ModalBodyContainer = styled.div`
  padding: 1rem 1rem;
`;

const ModalTitle = styled.h2`
  font-weight: bold;
  padding: 0 1rem;
  color: #36454f;
  align-self: flex-start;
`;

const SubTaskModal: React.FC<SubTaskModalProps> = ({handleSubTaskModal, task}) => {

    const { tasks, setTasks } = useData();
    const { selectedStartDate, setSelectedStartDate } = useData();
    const { selectedEndDate, setSelectedEndDate } = useData();
    
    const [projectName, setProjectName] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const options = tasks.map(singleTask => ({ value: singleTask.id, label: singleTask.name }));

    const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProgress(parseFloat(event.target.value));
    };
    
    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedStartDate(new Date(event.target.value));
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedEndDate(new Date(event.target.value));
    };

    const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);
    };

    const handleDropdownChange = (selectedOptions: string[]) => {
        setSelectedOptions(selectedOptions || []);
    };

    const handleSubmit = (task: Task) => {
        // event.preventDefault();

        const selectedValues = selectedOptions.map(option => option.value);
        console.log("project is")
        console.log(task)
        const newTask = {
          start: selectedStartDate,
          end: selectedEndDate,
          name: projectName,
          id: projectName.replace(/\s+/g, ''),
          progress: progress,
          type: "task",
          displayOrder: tasks.length + 1,
          dependencies: selectedValues,
          project: task.id,
        };
        // console.log("task is")
        // console.log(newTask)

        setTasks([...tasks, newTask]);
    }

    return (
        <ModalContainer>
        <ModalContentContainer>
            <AiOutlineCloseCircle
            className="close-icon"
            onClick={handleSubTaskModal}
            />
            <ModalTitle>Add Sub-Task</ModalTitle>
            <HorizontalDivider/>
            <ModalBodyContainer>
            <Form>
                <Label>Sub-Task Name</Label>
                <Input 
                    placeholder="Eg. Bell Weir Design"
                    value={projectName}
                    onChange={handleProjectNameChange}
                />

                <Label htmlFor="start-date-input">Start Date</Label>
                <Input type="date" id="start-date-input" name="start-date" onChange={handleStartDateChange} />

                <Label htmlFor="end-date-input">End Date</Label>
                <Input type="date" id="end-date-input" name="end-date" onChange={handleEndDateChange} />

                <Label>Sub-Task Dependencies</Label>
                <Select
                    closeMenuOnSelect={false}
                    isMulti
                    value={selectedOptions}
                    options={options}
                    onChange={handleDropdownChange}
                />

                <Label htmlFor="progress-slider">Task Progress: {progress}%</Label>
                <input
                    type="range"
                    id="progress-slider"
                    name="progress"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                />

                <Button onClick={() => handleSubmit(task)}>Submit</Button>
            </Form>
            </ModalBodyContainer>
        </ModalContentContainer>
        </ModalContainer>
    );
    };
export default SubTaskModal;
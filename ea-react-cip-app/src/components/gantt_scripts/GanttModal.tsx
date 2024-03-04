import React, { useState } from 'react';
import { styled } from "styled-components";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Button } from 'react-bootstrap';
import { useData } from '../../contexts/useDataContext';

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

const Modal = ({ handleDisplayModal }) => {


    const { tasks, setTasks } = useData();
    const [projectName, setProjectName] = useState('')
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleProgressChange = (event) => {
        setProgress(event.target.value);
    };
    
    const handleStartDateChange = (event) => {
        setSelectedStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setSelectedEndDate(event.target.value);
    };

    const handleProjectNameChange = (event) => {
        setProjectName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
  
        const newTask = {
          start: new Date(selectedStartDate),
          end: new Date(selectedEndDate),
          name: projectName,
          id: projectName.replace(/\s+/g, ''),
          progress: parseInt(progress, 10),
          type: "project",
          hideChildren: false,
          displayOrder: tasks.length + 1,
        };
      
        console.log(newTask)

        setTasks([...tasks, newTask]);
    }

    return (
        <ModalContainer>
        <ModalContentContainer>
            <AiOutlineCloseCircle
            className="close-icon"
            onClick={handleDisplayModal}
            />
            <ModalTitle>Add Weir Project</ModalTitle>
            <HorizontalDivider/>
            <ModalBodyContainer>
            <Form>
                <Label>Project Name</Label>
                <Input 
                    placeholder="Eg. Bell Weir"
                    value={projectName}
                    onChange={handleProjectNameChange}
                />

                <Label htmlFor="start-date-input">Start Date</Label>
                <Input type="date" id="start-date-input" name="start-date" onChange={handleStartDateChange} />

                <Label htmlFor="end-date-input">End Date</Label>
                <Input type="date" id="end-date-input" name="end-date" onChange={handleEndDateChange} />

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

                <Button onClick={handleSubmit}>Submit</Button>
            </Form>
            </ModalBodyContainer>
        </ModalContentContainer>
        </ModalContainer>
    );
    };
export default Modal;
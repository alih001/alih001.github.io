import styled from "styled-components";
import { FaInfoCircle } from "react-icons/fa";

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #333; /* Darker text for better readability */
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const EmptyStateMessage: React.FC<{ message: string }> = ({
  message,
}) => (
  <EmptyState>
    <FaInfoCircle size={20} />
    <span>{message}</span>
  </EmptyState>
);

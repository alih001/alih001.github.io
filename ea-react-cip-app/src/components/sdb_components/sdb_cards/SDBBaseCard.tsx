// BaseCard.tsx
import styled, { css } from "styled-components";

const BaseCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 0.5rem;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  /* Variant for chart cards */
  ${(props) =>
    props.variant === "chart" &&
    css`
      padding: 1.5rem;
      margin: 1rem 0;
    `}

  /* Variant for control cards */
  ${(props) =>
    props.variant === "control" &&
    css`
      max-width: 300px;
    `}
`;

export default BaseCard;

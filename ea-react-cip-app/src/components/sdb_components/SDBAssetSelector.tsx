// import React, { useState } from "react";
// import styled from "styled-components";
// import { useAssetSelector } from "../../hooks/useAssetSelector";
// import { AssetSelectorProps } from "../../types/public-types";
// import SDBModal from "./sdb_cards/SDBModal";
// import { FaPlus, FaTimes } from "react-icons/fa";

// const AssetSelectorWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// // A full-width, modern button for triggering asset selection
// const AddAssetButton = styled.button`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   width: 100%;
//   padding: 1rem;
//   background: #007bff;
//   border: none;
//   color: #fff;
//   border-radius: 8px;
//   font-size: 1.1rem;
//   cursor: pointer;
//   transition: background 0.2s ease;

//   &:hover {
//     background: #0056b3;
//   }
// `;

// // Styling for the modal content container
// const ModalContentContainer = styled.div`
//   background: #fff;
//   padding: 2rem;
//   border-radius: 8px;
//   max-width: 500px;
//   width: 100%;
//   box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
// `;

// // Title styling inside modal
// const ModalTitle = styled.h3`
//   margin-top: 0;
//   margin-bottom: 1rem;
//   font-size: 1.5rem;
//   text-align: center;
// `;

// // List styling for assets: no bullet, padded items, subtle border and spacing
// const AssetList = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
//   display: flex;
//   flex-direction: column;
//   gap: 0.75rem;
// `;

// const AssetItem = styled.li`
//   display: flex;
//   align-items: center;
//   padding: 0.75rem 1rem;
//   border: 1px solid #ddd;
//   border-radius: 6px;
//   transition: background 0.2s ease;

//   &:hover {
//     background: #f0f8ff;
//   }
// `;

// // Label for each asset item, ensuring proper spacing
// const AssetLabel = styled.label`
//   display: flex;
//   align-items: center;
//   flex: 1;
//   font-size: 1rem;
//   color: #333;
// `;

// // Custom styled checkbox that doesn't get stretched by inherited styles
// const Checkbox = styled.input.attrs({ type: "checkbox" })`
//   margin-right: 0.75rem;
//   width: auto;
//   height: auto;
// `;

// // A close button styled as a text button with an icon
// const CloseButton = styled.button`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   background: #6c757d;
//   border: none;
//   color: #fff;
//   padding: 0.5rem 1rem;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 1rem;
//   transition: background 0.2s ease;
//   margin-top: 1rem;

//   &:hover {
//     background: #5a6268;
//   }
// `;

// const AssetSelector: React.FC<AssetSelectorProps> = ({ allAssets }) => {
//   const { selectedAssets, handleToggleAsset } = useAssetSelector();
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <AssetSelectorWrapper>
//       <AddAssetButton onClick={() => setShowModal(true)}>
//         <FaPlus />
//         Add Asset
//       </AddAssetButton>
//       <SDBModal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <ModalContentContainer onClick={(e) => e.stopPropagation()}>
//           <ModalTitle>Select Assets to Implement</ModalTitle>
//           <AssetList>
//             {allAssets.map((assetName) => (
//               <AssetItem key={assetName}>
//                 <AssetLabel>
//                   <Checkbox
//                     checked={selectedAssets.has(assetName)}
//                     onChange={() => handleToggleAsset(assetName)}
//                   />
//                   {assetName}
//                 </AssetLabel>
//               </AssetItem>
//             ))}
//           </AssetList>
//           <CloseButton onClick={() => setShowModal(false)}>
//             <FaTimes />
//             Close
//           </CloseButton>
//         </ModalContentContainer>
//       </SDBModal>
//     </AssetSelectorWrapper>
//   );
// };

// export default AssetSelector;

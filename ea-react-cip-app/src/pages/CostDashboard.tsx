import React from 'react';
import styled from 'styled-components';
import DashboardCardComponent from '../components/custom_components/DashboardCard';
import { useData } from '../contexts/useDataContext';
import { Button, Modal } from 'react-bootstrap';
import Example from '../charts/BarChart';
import PackageChart from '../charts/PackageChart';
import { TableData, TableRow as AssetTableRow, WeirRow } from '../types/public-types'

import PackageForm from '../components/weir_package_components/PackageForm'

const HeroSection = styled.section`
  background-position: center, bottom left;
  background-size: cover, cover;
  height: fit-content;
  color: #3C474B;
  padding: 3rem 23rem 1rem;
  .heroInner {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
  }
  span {
    max-width: 80%;
  }
  h1 {
    font-weight: 900;
    font-size: clamp(2rem, 5.5vw, 3.25rem);
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
`;

const Background = styled.div`
  background-image: url('./src/assets/images/home_page_background.png');
  background-size: cover;
  background-repeat: no-repeat; 
  background-position: center; 
  min-height: 100vh;
`;

const CostCard = styled.div`
  border-radius: 15px;
  width:95%;  
  margin-left:2rem;
  height:40rem;
`;


// const CustomButton = styled.button`
//   margin-left: 1rem;
// `;

const CostDashboard: React.FC = () => {

  const { table1Data, table2Data } = useData();
  const { showCostPackageModal, setShowCostPackageModal } = useData();
  const { selectedWeirs, setSelectedWeirs } = useData();
  const { chartData, setChartData } = useData();

  const parseData = (data: TableData) => {
    const headers = data[0];
    return data.slice(1).map((row: AssetTableRow) => {
      const obj: WeirRow = {
        'Weir Name': '',
        'Package Cost': 0,
      };
      row.forEach((value, index) => {
        const header = String(headers[index]);
        obj[header] = value;
      });
      return obj;
    });
  };
  
  const table1parsedData = parseData(table1Data);
  const parsedData = parseData(table2Data);

  const handleCheckboxChange = (weirName: string) => {
    if (selectedWeirs.includes(weirName)) {
      setSelectedWeirs(prev => prev.filter(name => name !== weirName));
    } else {
      setSelectedWeirs(prev => [...prev, weirName]);
    }  };


  const displayTotalCosts = () => {

    // console.log(selectedWeirs);
    // console.log(parsedData);
    
    const totalCosts = getTotalCostForWeirs(selectedWeirs, parsedData);

    const filteredData = table2Data.slice(1).filter(row => row[1] === "Package Summary");

    const headers = table2Data[0].slice(6); // Assuming cost data starts from the 7th column
    console.log(headers)
    const transformedData = headers.map((header, index) => {
        const obj = { date: header };
        filteredData.forEach(row => {
            const weirName = row[0];
            const costValue = row[6 + index]; // Adjust index to match cost data columns
            obj[weirName] = costValue.toString(); // Convert to string if necessary
        });
        return obj;
    });


    console.log(transformedData)
    // Update chart data here
    // const updatedChartData = calculateChartData(totalCosts); // You'll define how you calculate this
    setChartData(transformedData);

  };

  const getTotalCostForWeirs = (weirNames: string[], parsedData: WeirRow[]) => {
    return parsedData
      .filter(row => weirNames.includes(row['Weir Name']))
      .reduce((total, row) => total + (row['Package Cost']), 0);
  };

  const filteredChartData = chartData.map(dataItem => {
    const filteredItem = {};
    // Keep only the keys that are included in selectedWeirs plus any key you always want to keep, like 'date'
    Object.keys(dataItem).forEach(key => {
      if (selectedWeirs.includes(key) || key === 'date') {
        filteredItem[key] = dataItem[key];
      }
    });
    return filteredItem;
  });

  return(

    <Background>
      <HeroSection className="light hero">
        <div className="heroInner">
          <span>
          <h1>Cost Dashboard</h1>
          </span>
        </div>
      </HeroSection>

      <Button onClick={() => setShowCostPackageModal(true)}>Select Weirs</Button>

      <Modal show={showCostPackageModal} onHide={() => setShowCostPackageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Package 1</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="secondary" onClick={() => setShowCostPackageModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={displayTotalCosts}>
            Show Total Costs for Selected Weirs
          </Button>
          <PackageForm
            tableParsedData={table1parsedData}
            selectedWeirs={selectedWeirs}
            handleCheckboxChange={handleCheckboxChange}
          />
        </Modal.Body>
      </Modal>
      <CostCard>
        {
          selectedWeirs.length > 0 && showCostPackageModal===false && (
            <>
              <DashboardCardComponent
                title="Total Package Costs by Year"
                width={79} height={35}
                left={1} top={3}
              >
                <Example width={1250} height={450} inputData={filteredChartData}></Example>
              </DashboardCardComponent>

              <DashboardCardComponent
              title="Total Package Costs by Type"
              width = {79} height = {35}
              left = {1} top = {3}
              >
                <PackageChart width={1200} height={450} inputData={filteredChartData}/>
              </DashboardCardComponent>
            </>
          )
        }
      </CostCard>
    </Background>
  );
}
export default CostDashboard;
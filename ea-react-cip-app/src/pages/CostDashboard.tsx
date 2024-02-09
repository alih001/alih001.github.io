import React from 'react';
import styled from 'styled-components';
import DashboardCardComponent from '../components/DashboardCard';
import { useData } from '../contexts/DataContext';
import { Button, Form, Modal } from 'react-bootstrap';
import Example from '../charts/BarChart';
import PackageChart from '../charts/PackageChart';
import { TableData, TableRow, WeirRow } from '../types/public-types'


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

  const { table2Data } = useData();
  const { showCostPackageModal, setShowCostPackageModal } = useData();
  const { selectedWeirs, setSelectedWeirs } = useData();
  const { chartData, setChartData } = useData();

  const parseData = (data: TableData) => {
    const headers = data[0];
    return data.slice(1).map((row:TableRow) => {
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
  
  const parsedData = parseData(table2Data);

  const handleCheckboxChange = (weirName: string) => {
    toggleWeirSelection(weirName);
  };

  const toggleWeirSelection = (weirName: string) => {
    if (selectedWeirs.includes(weirName)) {
      setSelectedWeirs(prev => prev.filter(name => name !== weirName));
    } else {
      setSelectedWeirs(prev => [...prev, weirName]);
    }
  };

  const displayTotalCosts = () => {
    console.log(selectedWeirs);
    console.log(parsedData);
    
    const totalCosts = getTotalCostForWeirs(selectedWeirs, parsedData);
    console.log(parsedData);
    console.log(`Total Costs for selected Weirs: ${totalCosts}`);
    
    // Update chart data here
    // const updatedChartData = calculateChartData(totalCosts); // You'll define how you calculate this
    setChartData(totalCosts);

  };

  const getTotalCostForWeirs = (weirNames: string[], parsedData: WeirRow[]) => {
    return parsedData
      .filter(row => weirNames.includes(row['Weir Name']))
      .reduce((total, row) => total + (row['Package Cost']), 0);
  };

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
          <Form>
            {[...new Set(parsedData.map(data => data['Weir Name']))].map(weir => (
              <Form.Check
                key={weir}
                type="checkbox"
                label={weir}
                onChange={() => handleCheckboxChange(weir)}
                checked={selectedWeirs.includes(weir)}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCostPackageModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={displayTotalCosts}>
            Show Total Costs for Selected Weirs
          </Button>
        </Modal.Footer>
      </Modal>
      <CostCard>
        {selectedWeirs}
              
        {chartData}
        <DashboardCardComponent
          title="Total Package Costs by Year"
          width = {79} height = {35}
          left = {1} top = {3}
        >
          <Example width={1250} height={450}></Example>
        </DashboardCardComponent>

        <DashboardCardComponent
          title="Total Package Costs by Type"
          width = {79} height = {35}
          left = {1} top = {3}
        >
          <PackageChart width={1200} height={450} />
        </DashboardCardComponent>

      </CostCard>

    </Background>
  );
}
export default CostDashboard;
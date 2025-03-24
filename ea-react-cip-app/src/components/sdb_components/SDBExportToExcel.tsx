import { handleExportToExcel } from "../../utils/exportUtils";
import { useData } from "../../contexts/useDataContext";
import { useChartData } from "../../hooks/useChartData";

const ExportButton: React.FC = () => {
  const {
    wrzList,
    wrzData,
    assetDetailsMap,
    filterCriteria,
    demandData,
    supplyData,
    customAssets,
  } = useData();

  const { demandForChart, supplyForChart } = useChartData();

  return (
    <button
      onClick={() =>
        handleExportToExcel({
          wrzList,
          wrzData,
          assetDetailsMap,
          filterCriteria,
          demandForChart,
          supplyForChart,
          customAssets,
        })
      }
    >
      Export Scenario to Excel
    </button>
  );
};

export default ExportButton;

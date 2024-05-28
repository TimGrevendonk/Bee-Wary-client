import { Select, SelectItem } from '@nextui-org/react';
import { getAllBeehiveNamesAndIDs } from '@/services/server/beehives/queries';
import { getAllStatistics } from '@/services/server/statistics/queries';
import { StatiscticsForm } from '@/components/statistics/statisticsForm';

const Statisticspage = async ({ params, searchParams }: { params: { inspectionID?: string }; searchParams: { beehiveRefID?: string } }) => {
  const allBeehivesNames: BeehiveName[] = (await getAllBeehiveNamesAndIDs()).documents;
  const allStatistics: StatisticsList[] = (await getAllStatistics()).documents;

  return <StatiscticsForm beehiveNames={allBeehivesNames} StatisticsList={allStatistics} />;
};

export default Statisticspage;

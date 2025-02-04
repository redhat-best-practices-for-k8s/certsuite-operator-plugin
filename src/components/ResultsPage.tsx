import * as React from 'react';
import {
  ListPageHeader,
  ListPageBody,
  VirtualizedTable,
  K8sResourceCommon,
  TableData,
  RowProps,
  TableColumn,
} from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from './ProgressBar'; // Import the ProgressBar component

interface CertSuiteRun extends K8sResourceCommon {
  status: {
    report: {
      results: Results[];
      summary: Summary;
    };
  };
}

interface Summary {
  errored: number;
  failed: number;
  passed: number;
  skipped: number;
  total: number;
}

interface Results {
  testCaseName: string;
  result: string;
  reason?: string;
}

const columns: TableColumn<CertSuiteRun>[] = [
  {
    title: 'Test Case Name',
    id: 'testCaseName',
  },
  {
    title: 'Result',
    id: 'result',
  },
  {
    title: 'Reason',
    id: 'reason',
  },
];

const CertSuiteRunRow: React.FC<RowProps<Results>> = ({ obj, activeColumnIDs }) => {
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        {obj.testCaseName}
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {obj.result}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {obj.reason || 'N/A'}
      </TableData>
    </>
  );
};

const CertSuiteRunTable: React.FC<{ data: Results[]; loaded: boolean; loadError: any }> = ({
  data,
  loaded,
  loadError,
}) => (
  <VirtualizedTable<Results>
    data={data}
    unfilteredData={data}
    loaded={loaded}
    loadError={loadError}
    columns={columns}
    Row={CertSuiteRunRow}
  />
);

const ResultsPage: React.FC<{ obj: CertSuiteRun }> = ({ obj }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = React.useState<string>('all'); // Default to showing all results

  const summary = obj?.status?.report?.summary || {
    errored: 0,
    failed: 0,
    passed: 0,
    skipped: 0,
    total: 0,
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter === activeFilter ? 'all' : filter); // Toggle filter off/on
  };

  // Filtered results based on activeFilter
  const filteredResults = obj.status.report.results.filter(result => {
    switch (activeFilter) {
      case 'passed':
        return result.result === 'passed';
      case 'failed':
        return result.result === 'failed';
      case 'skipped':
        return result.result === 'skipped';
      case 'errored':
        return result.result === 'errored';
      default:
        return true; // Show all results if activeFilter is 'all' or unknown
    }
  });

  return (
    <>
      <ProgressBar
        summary={summary}
        onFilterChange={handleFilterChange}
      />

      <ListPageHeader title={t('Certification Suite Run Results')} />
      <ListPageBody>
      {filteredResults.length === 0 ? (
          <div className="no-results">{t('No results found for the selected filter')}</div>
        ) : (
          <CertSuiteRunTable data={filteredResults} loaded loadError={null} />
        )}
      </ListPageBody>
    </>
  );
};

export default ResultsPage;

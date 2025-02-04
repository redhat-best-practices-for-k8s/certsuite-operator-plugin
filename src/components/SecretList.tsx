import * as React from 'react';
import {
  ListPageHeader,
  ListPageBody,
  ListPageCreate,
  VirtualizedTable,
  useK8sWatchResource,
  K8sResourceCommon,
  TableData,
  RowProps,
  ResourceLink,
  ResourceIcon,
  TableColumn,
} from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';

type SecretTableTableProps = {
  data: K8sResourceCommon[];
  unfilteredData: K8sResourceCommon[];
  loaded: boolean;
  loadError: any;
};

const SecretTable: React.FC<SecretTableTableProps> = ({ data, unfilteredData, loaded, loadError }) => {
  const { t } = useTranslation();

  const columns: TableColumn<K8sResourceCommon>[] = [
    {
      title: t('plugin__certsuite-operator-plugin~Name'),
      id: 'name',
    },
    {
      title: t('plugin__certsuite-operator-plugin~NameSpace'),
      id: 'namespace',
    },
  ];

  const SecretRow: React.FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => {
    return (
      <>
        <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
          <ResourceLink kind="Secret" name={obj.metadata.name} namespace={obj.metadata.namespace} />
        </TableData>
        <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
          <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
        </TableData>
      </>
    );
  };

  return (
    <VirtualizedTable<K8sResourceCommon>
      data={data}
      unfilteredData={unfilteredData}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={SecretRow}
    />
  );
};

const ListSecret = ({namespace,name}) => {
  const { t } = useTranslation();

  const [resources, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      version: 'v1',                         
      kind: 'Secret',      
    },
    namespace,
    name,
    isList: true,
    namespaced: true,
  });

  return (
    <>
      <ListPageHeader title={t('plugin__certsuite-operator-plugin~CertSuiteRun Secrets List')}>
      <ListPageCreate groupVersionKind={{version: 'v1', kind: 'Secret' }}>
          {t('plugin__certsuite-operator-plugin~Create a Secret')}
        </ListPageCreate> 
      </ListPageHeader>
      <ListPageBody>
        <SecretTable
          data={resources}
          unfilteredData={resources}
          loaded={loaded}
          loadError={loadError}
        />
      </ListPageBody>
      <ListPageBody>
        <p>{t('plugin__certsuite-operator-plugin~Sample ResourceIcon for Secret')}</p>
        <ResourceIcon kind="Secret" />
      </ListPageBody>
    </>
  );
};

export default ListSecret;

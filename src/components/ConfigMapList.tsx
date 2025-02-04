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

type ConfigMapTableTableProps = {
  data: K8sResourceCommon[];
  unfilteredData: K8sResourceCommon[];
  loaded: boolean;
  loadError: any;
};

const ConfigMapTable: React.FC<ConfigMapTableTableProps> = ({ data, unfilteredData, loaded, loadError }) => {
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

  const ConfigMapRow: React.FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => {
    return (
      <>
        <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
          <ResourceLink kind="ConfigMap" name={obj.metadata.name}  namespace={obj.metadata.namespace} />
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
      Row={ConfigMapRow}
    />
  );
};

const ListConfigMap = ({namespace,name}) => {
  const { t } = useTranslation();

  const [resources, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      version: 'v1',                         
      kind: 'ConfigMap',      
    },
    namespace,
    name,
    isList: true,
    namespaced: true,
  });

  return (
    <>
      <ListPageHeader title={t('plugin__certsuite-operator-plugin~CertSuiteRun ConfigMap List')}>
      <ListPageCreate groupVersionKind={{version: 'v1', kind: 'ConfigMap' }}>
          {t('plugin__certsuite-operator-plugin~Create a ConfigMap')}
        </ListPageCreate> 
      </ListPageHeader>
      <ListPageBody>
        <ConfigMapTable
          data={resources}
          unfilteredData={resources}
          loaded={loaded}
          loadError={loadError}
        />
      </ListPageBody>
      <ListPageBody>
        <p>{t('plugin__certsuite-operator-plugin~Sample ResourceIcon for ConfigMap')}</p>
        <ResourceIcon kind="ConfigMap" />
      </ListPageBody>
    </>
  );
};

export default ListConfigMap;

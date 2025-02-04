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

type CertsuiteRunTableProps = {
  data: K8sResourceCommon[];
  unfilteredData: K8sResourceCommon[];
  loaded: boolean;
  loadError: any;
};

const CertsuiteRunTable: React.FC<CertsuiteRunTableProps> = ({ data, unfilteredData, loaded, loadError }) => {
  const { t } = useTranslation();

  const columns: TableColumn<K8sResourceCommon>[] = [
    {
      title: t('plugin__certsuite-operator-plugin~Name'),
      id: 'name',
    },
    {
      title: t('plugin__certsuite-operator-plugin~Namespace'),
      id: 'namespace',
    },
  ];

  const CertsuiteRunRow: React.FC<RowProps<K8sResourceCommon>> = ({ obj, activeColumnIDs }) => {
    return (
      <>
        <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
          <ResourceLink kind="best-practices-for-k8s.openshift.io~v1alpha1~CertsuiteRun" name={obj.metadata.name} namespace={obj.metadata.namespace}  />
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
      Row={CertsuiteRunRow}
    />
  );
};

const ListPage = ({namespace,name}) => {
  const { t } = useTranslation();

  const [resources, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      group: 'best-practices-for-k8s.openshift.io', 
      version: 'v1alpha1',                         
      kind: 'CertsuiteRun',      
    },
    namespace,
    name,
    isList: true,
    namespaced: true,
  });

  return (
    <>
      <ListPageHeader title={t('plugin__certsuite-operator-plugin~CertsuiteRun CRs List')}>
   
      </ListPageHeader>
      <ListPageHeader title={t('')}>
      <ListPageCreate groupVersionKind={{ group: 'best-practices-for-k8s.openshift.io', version: 'v1alpha1', kind: 'CertsuiteRun' }}>
          {t('plugin__certsuite-operator-plugin~Create a CertsuiteRun CR')}
        </ListPageCreate>
      </ListPageHeader>
      <ListPageBody>
        <CertsuiteRunTable
          data={resources}
          unfilteredData={resources}
          loaded={loaded}
          loadError={loadError}
        />
      </ListPageBody>
      <ListPageBody>
        <p>{t('plugin__certsuite-operator-plugin~Sample ResourceIcon for CertsuiteRun')}</p>
        <ResourceIcon kind="CertsuiteRun" />
      </ListPageBody>
    </>
  );
};

export default ListPage;

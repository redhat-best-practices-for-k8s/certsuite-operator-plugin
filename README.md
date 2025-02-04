# Certification Suite Operator's Console Plugin

[![red hat](https://img.shields.io/badge/red%20hat---?color=gray&logo=redhat&logoColor=red&style=flat)](https://www.redhat.com)
[![openshift](https://img.shields.io/badge/openshift---?color=gray&logo=redhatopenshift&logoColor=red&style=flat)](https://www.redhat.com/en/technologies/cloud-computing/openshift)

## Description

The `Certsuite plugin` is an
[openshift dynamic console plugin](https://github.com/openshift/console/tree/master/frontend/packages/console-dynamic-plugin-sdk)
extending the [OpenShift UI](https://github.com/openshift/console)
for the Certification Suite Operator.

This console plugin allows the possibility to run the
[Certification suites](https://github.com/redhat-best-practices-for-k8s/certsuite)
and review their results using the openshift console.

## Getting started

In order to extend the openshift console with the `certsuite plugin`,
you'll need to install the
[certification suite operator](https://github.com/redhat-best-practices-for-k8s/certsuite-operator)
on your cluster.

## Enable plugin

After installing the `Certification operator`, you might need to enable the plugin.

### Option 1: Operator was installed using OLM subscription

In this case the plugin should be automatically enabled.
If not, You can enable the plugin by navigating from `Operators` →
`Installed Operators` → `certsuite-operator`.
There, check the `Console plugin` checkbox as `Enabled` and refresh the page.

### Option 2: Operator was manually deployed

In this case the plugin is not automatically enabled.
You can enable the plugin by navigating from
`Administration` → `Cluster Settings` → `Configuration` →
`Console operator.openshift.io` → `Console plugins`,
and manually enabling the `certsuite-operator-plugin`.

## Using the plugin

Once the operator is installed and the plugin is enabled,
you should see a new tab added to the navigation bar:

<!-- markdownlint-disable-next-line no-inline-html -->
<img src="doc/navigation-bar-with-plugin.png" width="200" alt="navigation bar withplugin">
<!-- markdownlint-enable-next-line no-inline-html -->

You can add the required resources detailed
[here](https://github.com/redhat-best-practices-for-k8s/certsuite-operator?tab=readme-ov-file#how-to-customize-the-certification-suite-run),
by navigating to the corresponding tabs and using the `create` option.

The certification test results will appear under the
`Certification Suite CR's` corresponding to the created
certification run CR name.

See example:

![CertificationSuiteRun-CR-list](doc/cnfCertificationSuiteRun-CR-list.png)

Under the `Results` tab you can find the certification suites results.

See example:

![CertificationSuiteRun-results](doc/cnfCertificationSuiteRun-results.png)

/**
 * Runs a report of a Google Analytics 4 property ID. Creates a sheet with the
 * report.
 */
function runReport() {
  /**
   * TODO(developer): Uncomment this variable and replace with your
   *   Google Analytics 4 property ID before running the sample.
   */
  const propertyId = '269167519';

  try {
    const metric = AnalyticsData.newMetric();
    //  metric.name = 'activeUsers';

    metricList =  [ 
 
  {
    "name": "transactions"
  },
  {
    "name": "totalRevenue"
  },
  {
    "name": "activeUsers"
  },
  {
    "name": "sessions"
  },
  {
    "name": "newUsers"
  }

]

    const dimension = AnalyticsData.newDimension();
    dimensionList = [ 
  {
    "name": "date"
  },
  {
    "name": "source"
  },
  {
    "name": "medium"
  },
  {
    "name": "campaignName"
  }
]


    const dateRange = AnalyticsData.newDateRange();
    dateRange.startDate = 'yesterday';
    dateRange.endDate = 'yesterday';

    const request = AnalyticsData.newRunReportRequest();
    request.dimensions = [dimensionList];
    request.metrics = [metricList];
    request.dateRanges = dateRange;

    const report = AnalyticsData.Properties.runReport(request,
        'properties/' + propertyId);
    if (!report.rows) {
      Logger.log('No rows returned.');
      return;
    }

    const spreadsheet = SpreadsheetApp.create('Google Analytics Report');
    const sheet = spreadsheet.getActiveSheet();

    // Append the headers.
    const dimensionHeaders = report.dimensionHeaders.map(
        (dimensionHeader) => {
          return dimensionHeader.name;
        });
    const metricHeaders = report.metricHeaders.map(
        (metricHeader) => {
          return metricHeader.name;
        });
    const headers = [...dimensionHeaders, ...metricHeaders];

    sheet.appendRow(headers);

    // Append the results.
    const rows = report.rows.map((row) => {
      const dimensionValues = row.dimensionValues.map(
          (dimensionValue) => {
            return dimensionValue.value;
          });
      const metricValues = row.metricValues.map(
          (metricValues) => {
            return metricValues.value;
          });
      return [...dimensionValues, ...metricValues];
    });

    sheet.getRange(2, 1, report.rows.length, headers.length)
        .setValues(rows);

    Logger.log('Report spreadsheet created: %s',
        spreadsheet.getUrl());
  } catch (e) {
    // TODO (Developer) - Handle exception
    Logger.log('Failed with error: %s', e.error);
  }
}

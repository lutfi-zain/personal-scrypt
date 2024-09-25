// Import required AWS SDK clients and commands
const {
  CloudWatchClient,
  GetMetricStatisticsCommand,
} = require("@aws-sdk/client-cloudwatch");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const fs = require("fs");

// Initialize CloudWatch client
const client = new CloudWatchClient({
  region: "ap-southeast-3", // Update with your AWS region
  credentials: fromIni(), // Ensure your AWS credentials are configured
});

// List of RDS metrics to query
const metrics = [
  "CPUUtilization",
  "DatabaseConnections",
  "DiskQueueDepth",
  "FreeableMemory",
  "FreeStorageSpace",
  "ReadIOPS",
  "WriteIOPS",
  "ReadLatency",
  "WriteLatency",
  "ReadThroughput",
  "WriteThroughput",
  "NetworkReceiveThroughput",
  "NetworkTransmitThroughput",
  "ReplicaLag",
  "BinLogDiskUsage",
  "SwapUsage",
  "BurstBalance",
  "CPUCreditBalance",
  "CPUCreditUsage",
  "AuroraReplicaLag",
  "AuroraReplicaLagMaximum",
  "AuroraReplicaLagMinimum",
  "TransactionLogsDiskUsage",
  "MaximumUsedTransactionIDs",
  "OldestReplicationSlotLag",
  "BacktrackChangeRecordsStored",
  "SnapshotStorageUsed",
  "VolumeBytesUsed",
  "CommitLatency",
  "CommitThroughput",
  "DDLThroughput",
  "DMLThroughput",
];

// Specify your DB instance identifier
// const dbInstanceId = "kairos-pay-prod-db-iac";
const dbInstanceId = "keycloak-prod-db-iac";
// const dbInstanceId = "hope-db-prod-01";
// const dbInstanceId = "kairos-pas-prod-db-iac";
const StartTime = dayjs("2024-09-23T08:00:00").tz("Asia/Jakarta");
const EndTime = dayjs("2024-09-24T23:59:59").tz("Asia/Jakarta");

// Function to query CloudWatch for each metric
async function queryMetric(metric) {
  const command = new GetMetricStatisticsCommand({
    Namespace: "AWS/RDS",
    MetricName: metric,
    Dimensions: [
      {
        Name: "DBInstanceIdentifier",
        Value: dbInstanceId,
      },
    ],
    StartTime,
    EndTime,
    Period: 300, // 5-minute intervals
    Statistics: ["Average"], // Retrieve the average statistic
  });

  try {
    const data = await client.send(command);
    return { metric, data: data.Datapoints };
  } catch (err) {
    console.error(`Error fetching data for metric: ${metric}`, err);
    return { metric, data: [] };
  }
}

// Query all 32 metrics
async function queryAllMetrics() {
  const results = [];
  for (const metric of metrics) {
    const result = await queryMetric(metric);
    results.push(result);
  }
  return results;
}

// Calculate summary statistics
function calculateSummary(data) {
  if (data.length === 0) return { avg: 0, max: 0, min: 0 };

  const sum = data.reduce((acc, point) => acc + point.Average, 0);
  const avg = sum / data.length;
  const max = Math.max(...data.map(point => point.Average));
  const min = Math.min(...data.map(point => point.Average));

  return { avg, max, min };
}

// Generate HTML file with charts and summaries
async function generateHTML() {
  const metricsData = await queryAllMetrics();
  const chartsHtml = metricsData.map((metricData, index) => {
    const summary = calculateSummary(metricData.data);
    return `
      <div class="chart-container">
        <h2>${metricData.metric}</h2>
        <canvas id="chart${index}" width="400" height="200"></canvas>
        <div class="summary">
          <p>Average: ${summary.avg.toFixed(2)}</p>
          <p>Max: ${summary.max.toFixed(2)}</p>
          <p>Min: ${summary.min.toFixed(2)}</p>
        </div>
      </div>
    `;
  }).join("\n");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RDS Metrics Charts ${dbInstanceId}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
  <style>
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .chart-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .summary {
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h1>RDS Metrics Charts ${dbInstanceId}</h1>
  <h3>From ${StartTime.tz("Asia/Jakarta").toString()} To ${EndTime.tz("Asia/Jakarta").toString()}</h3>
  <div class="grid-container">
    ${chartsHtml}
  </div>
  <script>
    const metricsData = ${JSON.stringify(metricsData)};

    function processData(metricData) {
      const data = metricData.data
        .map(point => ({
          x: new Date(point.Timestamp),
          y: point.Average
        }))
        .sort((a, b) => a.x - b.x); // Sort data points by timestamp

      return {
        label: metricData.metric,
        data: data,
        fill: false,
        borderColor: getRandomColor(),
        tension: 0.1
      };
    }

    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function createCharts() {
      metricsData.forEach((metricData, index) => {
        const ctx = document.getElementById('chart' + index).getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [processData(metricData)]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'minute'
                },
                title: {
                  display: true,
                  text: 'Time'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Value'
                }
              }
            }
          }
        });
      });
    }

    createCharts();
  </script>
</body>
</html>
  `;

  fs.writeFileSync("metrics_charts.html", htmlContent);
  console.log("HTML file generated: metrics_charts.html");
}

// Execute the query and generate HTML
generateHTML();

// aws rds describe-db-instances --query "DBInstances[*].DBInstanceIdentifier" 

/** Prod
 * [
    "emr-db-prod-01",
    "emr-db-prod-01-readreplica",
    "emr-ed-db-prod-iac",
    "emr-rsuslv-db-prod-01",
    "emr-shkj-db-prod-01",
    "emr-shlv-db-prod-01",
    "emr-shmrccc-db-prod-01",
    "hope-db-int-prod-01",
    "hope-db-prod-01",
    "hope-db-prod-01-readreplica",
    "kairos-pas-prod-db-iac",
    "kairos-pay-prod-db-iac",
    "keycloak-prod-db-iac",
    "ods-postgre-db-prod-iac",
    "shg-db-prod-01"
]
 */

/** Preprod
 * [
    "emr-db-pg-preprod-iac",
    "emr-db-sit",
    "emr-decentral-sit",
    "emr-shlv-db-preprod-01",
    "hope-db-int-preprod-01",
    "hope-db-preprod-01",
    "kairos-pas-preprod-db-iac",
    "kairos-pay-preprod-db-iac",
    "keycloak-preprod-db-iac",
    "shg-db-sit"
]
 */

/** Staging
 * [
    "emr-db-uat-01",
    "emr-decentral-db-uat-01",
    "emr-ed-db-uat-iac",
    "hope-db-int-uat-01",
    "hope-db-uat",
    "kairos-uat-db-iac",
    "shg-db-uat-01"
]
 */

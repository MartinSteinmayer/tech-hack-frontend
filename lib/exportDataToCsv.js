// exportDataToCsv.js
const fs = require('fs');
const { Parser } = require('json2csv');
const { mockSuppliers, mockOrders, mockNegotiations, mockComplianceItems } = require('./mockData');

// Function to convert JSON to CSV and save it to a file
function exportToCSV(data, filename) {
  try {
    const parser = new Parser();
    const csv = parser.parse(data);
    fs.writeFileSync(filename, csv);
    console.log(`Successfully wrote ${filename}`);
  } catch (err) {
    console.error(`Error converting to CSV for ${filename}: `, err);
  }
}

// Export each dataset to a CSV file
exportToCSV(mockSuppliers, 'suppliers.csv');
exportToCSV(mockOrders, 'orders.csv');
exportToCSV(mockNegotiations, 'negotiations.csv');
exportToCSV(mockComplianceItems, 'compliance.csv');

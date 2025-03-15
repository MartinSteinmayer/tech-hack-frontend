/**
"use client";
import { useState, useMemo } from 'react';
// Import the chart components from react-chartjs-2
import { Pie, Bar, Line, Scatter } from 'react-chartjs-2';
// Import chart.js/auto to automatically register all chart components
import 'chart.js/auto';

import { mockSuppliers, mockOrders } from '../../lib/mockData';

export default function Report() {
  // ------------------------------------------
  // 1) RISK DISTRIBUTION (Pie Chart)
  // ------------------------------------------
  const riskCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    mockSuppliers.forEach((supplier) => {
      supplier.riskFactors.forEach((risk) => {
        if (counts[risk.level] !== undefined) {
          counts[risk.level] += 1;
        } else {
          counts[risk.level] = 1;
        }
      });
    });
    return counts;
  }, []);

  const pieData = {
    labels: Object.keys(riskCounts),
    datasets: [
      {
        data: Object.values(riskCounts),
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      },
    ],
  };

  // ------------------------------------------
  // 2) AVERAGE ORDER VALUE (Bar Chart)
  // ------------------------------------------
  const supplierOrderData = useMemo(() => {
    const data = {};
    mockOrders.forEach((order) => {
      const supplierId = order.supplierId;
      if (data[supplierId]) {
        data[supplierId].total += order.total;
        data[supplierId].count++;
      } else {
        data[supplierId] = { total: order.total, count: 1 };
      }
    });
    return data;
  }, []);

  const supplierLabels = Object.keys(supplierOrderData).map((id) => {
    const supplier = mockSuppliers.find((s) => s.id === parseInt(id));
    return supplier ? supplier.name : `Supplier ${id}`;
  });

  const avgOrderValues = Object.values(supplierOrderData).map(
    (data) => data.total / data.count
  );

  const barData = {
    labels: supplierLabels,
    datasets: [
      {
        label: 'Average Order Value',
        data: avgOrderValues,
        backgroundColor: '#42a5f5',
      },
    ],
  };

  // ------------------------------------------
  // 3) SUPPLIER PERFORMANCE OVER TIME (Line Chart)
  //    - Dropdown to select which supplier to show
  // ------------------------------------------
  const [selectedSupplierId, setSelectedSupplierId] = useState(mockSuppliers[0].id);

  // Find the selected supplier object
  const selectedSupplier = useMemo(
    () => mockSuppliers.find((s) => s.id === selectedSupplierId),
    [selectedSupplierId]
  );

  // Build line chart data based on the selected supplier's performance history
  const lineData = useMemo(() => {
    if (!selectedSupplier) return { labels: [], datasets: [] };

    return {
      labels: selectedSupplier.performanceHistory.map((item) => item.month),
      datasets: [
        {
          label: 'On-Time Delivery (%)',
          data: selectedSupplier.performanceHistory.map((item) => item.onTimeDelivery),
          borderColor: '#66bb6a',
          fill: false,
        },
        {
          label: 'Quality Compliance (%)',
          data: selectedSupplier.performanceHistory.map((item) => item.qualityCompliance),
          borderColor: '#42a5f5',
          fill: false,
        },
      ],
    };
  }, [selectedSupplier]);

  // Handler for dropdown changes
  const handleSupplierChange = (e) => {
    setSelectedSupplierId(Number(e.target.value));
  };

  // ------------------------------------------
  // 4) PROFIT MARGIN VS. RELIABILITY (Scatter Chart)
  // ------------------------------------------
  const scatterData = {
    datasets: [
      {
        label: 'Profit Margin vs. Reliability',
        data: mockSuppliers.map((supplier) => ({
          x: supplier.reliabilityScore,
          y: supplier.profitMargin,
        })),
        backgroundColor: '#ff7043',
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Interactive Procurement Report</h1>

        //Chart 1: Risk Distribution
        <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Risk Distribution</h2>
        <p className=" text-gray-600">
            This pie chart shows the overall distribution of supplier risks (low, medium, high).
        </p>
        <div style={{ maxWidth: '300px' }}>
            <Pie
            data={pieData}
            options={{ maintainAspectRatio: false }}
            width={300}
            height={300}
            />
        </div>
    </div>


      //Chart 2: Average Order Value
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Average Order Value per Supplier</h2>
        <p className="mb-2 text-gray-600">
          The bar chart illustrates the average order value computed from recent orders for each supplier.
        </p>
        <div className="w-full">
          <Bar data={barData} options={{ maintainAspectRatio: false }} height={400} />
        </div>
      </div>

      // Chart 3: Supplier Performance Over Time 
      <div className="mb-8">
        // Dropdown to select supplier
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold mr-4">Supplier Performance Over Time</h2>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedSupplierId}
            onChange={handleSupplierChange}
          >
            {mockSuppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
        <p className="mb-2 text-gray-600">
          The line chart shows trends in on-time delivery and quality compliance for{' '}
          <strong>{selectedSupplier?.name}</strong> over recent months.
        </p>
        <div className="w-full">
          <Line data={lineData} options={{ maintainAspectRatio: false }} height={400} />
        </div>
      </div>

       Chart 4: Profit Margin vs. Reliability Score 
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Profit Margin vs. Reliability Score</h2>
        <p className="mb-2 text-gray-600">
          This scatter chart compares each supplier’s reliability score against its profit margin.
        </p>
        <div className="w-full">
          <Scatter data={scatterData} options={{ maintainAspectRatio: false }} height={400} />
        </div>
      </div>
    </div>
  );
}
*/


"use client";
import { useState, useMemo } from 'react';
// Import the chart components from react-chartjs-2
import { Pie, Bar, Line, Scatter } from 'react-chartjs-2';
// Import chart.js/auto to automatically register all chart components
import 'chart.js/auto';

import { mockSuppliers, mockOrders } from '../../lib/mockData';

export default function Report() {
  // ------------------------------------------
  // 1) RISK DISTRIBUTION (Pie Chart)
  // ------------------------------------------
  const riskCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    mockSuppliers.forEach((supplier) => {
      supplier.riskFactors.forEach((risk) => {
        if (counts[risk.level] !== undefined) {
          counts[risk.level] += 1;
        } else {
          counts[risk.level] = 1;
        }
      });
    });
    return counts;
  }, []);

  const pieData = {
    labels: Object.keys(riskCounts),
    datasets: [
      {
        data: Object.values(riskCounts),
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      },
    ],
  };

  // ------------------------------------------
  // 2) AVERAGE ORDER VALUE (Bar Chart)
  // ------------------------------------------
  const supplierOrderData = useMemo(() => {
    const data = {};
    mockOrders.forEach((order) => {
      const supplierId = order.supplierId;
      if (data[supplierId]) {
        data[supplierId].total += order.total;
        data[supplierId].count++;
      } else {
        data[supplierId] = { total: order.total, count: 1 };
      }
    });
    return data;
  }, []);

  const supplierLabels = Object.keys(supplierOrderData).map((id) => {
    const supplier = mockSuppliers.find((s) => s.id === parseInt(id));
    return supplier ? supplier.name : `Supplier ${id}`;
  });

  const avgOrderValues = Object.values(supplierOrderData).map(
    (data) => data.total / data.count
  );

  const barData = {
    labels: supplierLabels,
    datasets: [
      {
        label: 'Average Order Value',
        data: avgOrderValues,
        backgroundColor: '#42a5f5',
      },
    ],
  };

  // ------------------------------------------
  // 3) SUPPLIER PERFORMANCE OVER TIME (Line Chart)
  //    (with dropdown to select supplier)
  // ------------------------------------------
  const [selectedSupplierId, setSelectedSupplierId] = useState(mockSuppliers[0].id);

  const selectedSupplier = useMemo(
    () => mockSuppliers.find((s) => s.id === selectedSupplierId),
    [selectedSupplierId]
  );

  const lineData = useMemo(() => {
    if (!selectedSupplier) return { labels: [], datasets: [] };
    return {
      labels: selectedSupplier.performanceHistory.map((item) => item.month),
      datasets: [
        {
          label: 'On-Time Delivery (%)',
          data: selectedSupplier.performanceHistory.map((item) => item.onTimeDelivery),
          borderColor: '#66bb6a',
          fill: false,
        },
        {
          label: 'Quality Compliance (%)',
          data: selectedSupplier.performanceHistory.map((item) => item.qualityCompliance),
          borderColor: '#42a5f5',
          fill: false,
        },
      ],
    };
  }, [selectedSupplier]);

  const handleSupplierChange = (e) => {
    setSelectedSupplierId(Number(e.target.value));
  };

  // ------------------------------------------
  // 4) RISK MATRIX (Scatter Chart)
  //    - Replaces the old Profit vs. Reliability scatter
  // ------------------------------------------
  // Step A: Map riskFactors to numeric levels
  // ---- Risk Matrix Logic ----
  function computeRiskValue(level) {
    switch (level) {
      case 'low':
        return 1;
      case 'medium':
        return 2;
      case 'high':
        return 3;
      default:
        return 0;
    }
  }

  const riskMatrixData = useMemo(() => {
    return mockSuppliers.map((supplier) => {
      // Average numeric risk across all riskFactors
      const totalRisk = supplier.riskFactors.reduce((sum, rf) => sum + computeRiskValue(rf.level), 0);
      const avgRisk = totalRisk / supplier.riskFactors.length; // x-axis

      // Define impact as annualRevenue / 100000
      const impact = supplier.annualRevenue / 100000; // y-axis

      return {
        x: avgRisk,
        y: impact,
        supplierName: supplier.name,
      };
    });
  }, []);

  const riskMatrixScatterData = {
    datasets: [
      {
        label: 'Risk Matrix',
        data: riskMatrixData,
        backgroundColor: '#ff7043',
      },
    ],
  };

  const riskMatrixOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Risk Probability (1=Low, 3=High)',
        },
        min: 0,
        max: 3,
      },
      y: {
        title: {
          display: true,
          text: 'Risk Impact (Annual Revenue in 100k)',
        },
        min: 0,
        max: 10, // Adjust if you have bigger annualRevenue
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            // Show supplier name in the tooltip
            const { x, y, supplierName } = context.raw;
            return `${supplierName}: Probability=${x.toFixed(1)}, Impact=${y.toFixed(1)}`;
          },
        },
      },
    },
    // Maintain or remove aspect ratio as needed
    maintainAspectRatio: false,
  };


  // ------------------------------------------
  // RENDER
  // ------------------------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Interactive Procurement Report</h1>

        {/* Chart 1: Risk Distribution */}
        <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Risk Distribution</h2>
        <p className=" text-gray-600">
            This pie chart shows the overall distribution of supplier risks (low, medium, high).
        </p>
        <div style={{ maxWidth: '300px' }}>
            <Pie
            data={pieData}
            options={{ maintainAspectRatio: false }}
            width={300}
            height={300}
            />
        </div>
    </div>

      {/* Chart 2: Average Order Value */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Average Order Value per Supplier</h2>
        <p className="mb-2 text-gray-600">
          The bar chart illustrates the average order value computed from recent orders for each supplier.
        </p>
        <div className="w-full">
          <Bar data={barData} options={{ maintainAspectRatio: false }} height={400} />
        </div>
      </div>

      {/* Chart 3: Supplier Performance Over Time (with dropdown) */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold mr-4">Supplier Performance Over Time</h2>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedSupplierId}
            onChange={handleSupplierChange}
          >
            {mockSuppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
        <p className="mb-2 text-gray-600">
          The line chart shows trends in on-time delivery and quality compliance for{' '}
          <strong>{selectedSupplier?.name}</strong> over recent months.
        </p>
        <div className="w-full">
          <Line data={lineData} options={{ maintainAspectRatio: false }} height={400} />
        </div>
      </div>

      {/* Chart 4: Risk Matrix */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Risk Matrix</h2>
        <p className="mb-2 text-gray-600">
          This scatter chart places each supplier according to their <em>risk probability</em> (x-axis)
          and <em>risk impact</em> (y-axis).
        </p>
        {/* Fixed-size container for smaller chart */}
        <div style={{ width: '400px', height: '300px' }}>
          <Scatter
            data={riskMatrixScatterData}
            options={riskMatrixOptions}
          />
        </div>
      </div>
    </div>
  );
}

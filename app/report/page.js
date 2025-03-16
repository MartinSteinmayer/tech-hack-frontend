"use client";
import { useState, useMemo } from 'react';
import { Pie, Bar, Line, Scatter } from 'react-chartjs-2';
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
  //    (Include suppliers with no orders => 0)
  // ------------------------------------------
  const supplierOrderData = useMemo(() => {
    const data = {};

    // Initialize each supplier with zero totals
    mockSuppliers.forEach((supplier) => {
      data[supplier.id] = { total: 0, count: 0 };
    });

    // Aggregate actual order totals
    mockOrders.forEach((order) => {
      const supplierId = order.supplierId;
      if (data[supplierId]) {
        data[supplierId].total += order.total;
        data[supplierId].count++;
      }
    });

    return data;
  }, []);

  // Build arrays for labels and data
  const supplierLabels = mockSuppliers.map((s) => s.name);
  const avgOrderValues = mockSuppliers.map((s) => {
    const { total, count } = supplierOrderData[s.id];
    return count === 0 ? 0 : total / count;
  });

  // Bar chart config
  const barData = {
    labels: supplierLabels,
    datasets: [
      {
        label: 'Average Order Value',
        data: avgOrderValues,
        backgroundColor: '#42a5f5',
        // barThickness: 30 // optionally fix bar width
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          // Rotate x-axis labels 45° so they don't overlap
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
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
  // ------------------------------------------
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
        max: 10,
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
        <p className="text-gray-600">
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
          The bar chart illustrates the average order value computed from recent orders for each supplier (0 if none).
        </p>
        <div className="w-full" style={{ height: 400 }}>
          <Bar data={barData} options={barOptions} />
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
        <div className="w-full" style={{ height: 400 }}>
          <Line data={lineData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Chart 4: Risk Matrix */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Risk Matrix</h2>
        <p className="mb-2 text-gray-600">
          This scatter chart places each supplier according to their <em>risk probability</em> (x-axis)
          and <em>risk impact</em> (y-axis).
        </p>
        <div style={{ width: '400px', height: '300px' }}>
          <Scatter data={riskMatrixScatterData} options={riskMatrixOptions} />
        </div>
      </div>
    </div>
  );
}

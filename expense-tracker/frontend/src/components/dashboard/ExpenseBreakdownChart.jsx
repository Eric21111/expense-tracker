import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getTransactions } from "../../services/transactionService";

const categoryColors = {
  Food: "url(#colorFood)",
  Transportation: "url(#colorTransport)",
  Bills: "url(#colorBills)",
  Entertainment: "url(#colorEntertainment)",
  Shopping: "url(#colorShopping)",
  Grocery: "url(#colorGrocery)",
  Others: "url(#colorOthers)"
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 shadow-lg">
        PHP {payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

const ExpenseBreakdownChart = ({ dateRange }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxValue, setMaxValue] = useState(5000);

  
  useEffect(() => {
    fetchExpenseData();
  }, [dateRange]);

  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      
      let response;
      
      if (dateRange) {
       
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        
        response = await getTransactions(
          startDate.toISOString(),
          endDate.toISOString()
        );
      } else {
       
        response = await getTransactions();
      }
      
      if (response.success) {
 
        const categorySpending = {};
        
        response.transactions.forEach(transaction => {
          if (transaction.type === "expense") {
            const category = transaction.category;
            categorySpending[category] = (categorySpending[category] || 0) + transaction.amount;
          }
        });
        
     
        const data = Object.entries(categorySpending)
          .map(([name, value]) => ({
            name,
            value,
            fill: categoryColors[name] || "url(#colorOthers)"
          }))
          .sort((a, b) => b.value - a.value);
        
        setChartData(data);
        
       
        if (data.length > 0) {
          const maxSpending = Math.max(...data.map(d => d.value));
          setMaxValue(Math.ceil(maxSpending / 1000) * 1000 || 5000);
        }
      }
    } catch (error) {
      console.error("Error fetching expense data:", error);
    } finally {
      setLoading(false);
    }
  };


  const top3 = chartData.slice(0, 3);

  return (
    <div
      className="bg-white p-6 shadow-md flex flex-col"
      style={{ borderRadius: "30px" }}
    >
      <h2 className="text-xl font-bold text-green-600 mb-6">
        Expense Breakdown
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">No expense data for this month</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-6">
       
        <div className="relative" style={{ height: "240px", minHeight: "240px", minWidth: "0" }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={240}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 0,
                left: 5,
                bottom: 0,
              }}
            >
          
              <defs>
                <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
                <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="colorBills" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
                <linearGradient id="colorEntertainment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <linearGradient id="colorShopping" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <linearGradient id="colorGrocery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
                <linearGradient id="colorOthers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A3E635" />
                  <stop offset="100%" stopColor="#84CC16" />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#6b7280" strokeDasharray="2 2" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 15, fill: "#000000", fontWeight: 900, fontFamily: "Arial, sans-serif" }}
                dy={10}
              />
              <YAxis
                domain={[0, maxValue]}
                ticks={[0, Math.round(maxValue * 0.2), Math.round(maxValue * 0.4), Math.round(maxValue * 0.6), Math.round(maxValue * 0.8), maxValue]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 17, fill: "#000000", fontWeight: 900, fontFamily: "Arial Black, sans-serif" }}
                width={85}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
                wrapperStyle={{ zIndex: 50 }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    style={{ cursor: "pointer" }}
                    onMouseOver={(e) => (e.target.style.fillOpacity = 0.9)}
                    onMouseOut={(e) => (e.target.style.fillOpacity = 1)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      
        <div className="flex flex-col justify-center h-full">
          <h3 className="text-base font-bold text-green-600 mb-3">
            Top 3 Spending
          </h3>
          <div className="space-y-2">
            {top3.length > 0 ? (
              top3.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-800 font-medium">{index + 1}.</span>
                    <p className="text-sm text-gray-800 font-medium">{item.name}</p>
                  </div>
                  <p className="text-sm text-gray-800 font-medium">PHP {item.value.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-xs">No data available</p>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ExpenseBreakdownChart;
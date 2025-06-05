// src/components/features/sort-history/StatisticsChart.tsx
"use client";

import React, { useMemo } from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { RobotLog } from '@/types/robot';
import { Info } from 'lucide-react';

// Couleurs pour le PieChart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Pour le rendu d'une étiquette active dans le PieChart (optionnel)
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-semibold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs dark:fill-gray-300">{`${value} tris`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`( ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


const StatisticsChart = () => {
  const { logs, isLoadingLogs, errorLogs } = useRobot(); // Utilise les logs déjà fetchés par HistoryTable
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const processedData = useMemo(() => {
    if (!logs || logs.length === 0) return { byType: [], successRate: [] };

    const successfulSorts = logs.filter(log => log.eventType === 'SORT_ATTEMPT' && log.sortSuccessful);
    const failedSorts = logs.filter(log => log.eventType === 'SORT_ATTEMPT' && !log.sortSuccessful);

    const countsByType: { [key: string]: number } = {};
    successfulSorts.forEach(log => {
      if (log.detectedObject) {
        countsByType[log.detectedObject] = (countsByType[log.detectedObject] || 0) + 1;
      }
    });

    const dataForBarChart = Object.entries(countsByType)
      .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }))
      .sort((a,b) => b.count - a.count); // Trier par nombre de tris

    const dataForPieChart = [
      { name: 'Tris Réussis', value: successfulSorts.length, color: '#00C49F' },
      { name: 'Tris Échoués', value: failedSorts.length, color: '#FF8042' },
    ];

    return { byType: dataForBarChart, successRate: dataForPieChart };
  }, [logs]);

  if (isLoadingLogs && !logs.length) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Chargement des statistiques...</div>;
  }
  if (errorLogs) {
    return <div className="p-4 text-red-600 dark:text-red-400">Erreur de chargement des statistiques : {errorLogs}</div>;
  }
  if (logs.length === 0 || (processedData.byType.length === 0 && processedData.successRate[0]?.value === 0 && processedData.successRate[1]?.value === 0)) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center"><Info className="mr-2 h-5 w-5"/>Aucune donnée pour afficher les statistiques.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart for types of waste */}
      {processedData.byType.length > 0 && (
        <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
          <h4 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-200">Tris par Type de Déchet</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.byType} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="Nombre de tris" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie Chart for success rate */}
      {(processedData.successRate[0]?.value > 0 || processedData.successRate[1]?.value > 0) && (
        <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
          <h4 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-200">Taux de Réussite des Tris</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={processedData.successRate}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8" // Couleur par défaut, sera surchargée par Cell
                dataKey="value"
                onMouseEnter={onPieEnter}
                paddingAngle={2}
              >
                {processedData.successRate.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatisticsChart;
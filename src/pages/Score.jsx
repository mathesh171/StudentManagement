import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';
import Logo from '../components/Logo';
import LogoutButton from '../components/LogoutButton';
import styles from '../styles/Score.module.css';
import FilterButton from '../components/FilterButton';

const Score = () => {
  const [data, setData] = useState({ students: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    batch: '',
    department: '',
    student: ''
  });

  // Colors for charts - greenish-bluish palette
  const COLORS = ['#3b82f6', '#22c55e', '#06b6d4', '#10b981', '#0ea5e9', '#14b8a6', '#0d9488', '#059669'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/db.json');
      const jsonData = await response.json();
      setData(jsonData || { students: [] });
      setFilteredData(jsonData.students || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({ students: [] });
      setFilteredData([]);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    let filtered = data.students || [];
    
    // Apply filters in sequence
    if (newFilters.batch) {
      filtered = filtered.filter(student => student.batch === newFilters.batch);
    }
    if (newFilters.department) {
      filtered = filtered.filter(student => student.dept === newFilters.department);
    }
    if (newFilters.student) {
      filtered = filtered.filter(student => student.name === newFilters.student);
    }
    
    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setFilters({ batch: '', department: '', student: '' });
    setFilteredData(data.students || []);
  };
  // Update getUniqueValues to consider current filters
  const getUniqueValues = (field, currentFilters) => {
    let filteredStudents = data.students || [];
    
    // Apply other active filters except the one we're getting values for
    if (currentFilters.batch && field !== 'batch') {
      filteredStudents = filteredStudents.filter(student => student.batch === currentFilters.batch);
    }
    if (currentFilters.department && field !== 'department') {
      filteredStudents = filteredStudents.filter(student => student.dept === currentFilters.department);
    }
    
    return [...new Set(filteredStudents.map(item => {
      if (field === 'department') return item.dept;
      return item[field];
    }))].filter(Boolean);
  };

  // Prepare data for charts
  const prepareScoreDistribution = () => {
    const scoreRanges = {
        '90-100': 0,
        '80-89': 0,
        '70-79': 0,
        '60-69': 0,
        'Below 60': 0
    };

    filteredData.forEach(student => {
        let totalScore = 0;
        let subjectCount = 0;
        
        if (student.scores) {
            for (const sem in student.scores) {
                for (const subject in student.scores[sem]) {
                    totalScore += student.scores[sem][subject];
                    subjectCount++;
                }
            }
        }
        
        const avgScore = subjectCount > 0 ? totalScore / subjectCount : 0;
        
        if (avgScore >= 90) scoreRanges['90-100']++;
        else if (avgScore >= 80) scoreRanges['80-89']++;
        else if (avgScore >= 70) scoreRanges['70-79']++;
        else if (avgScore >= 60) scoreRanges['60-69']++;
        else scoreRanges['Below 60']++;
    });

    // Ensure all ranges have at least 0.0% to maintain consistency
    return Object.entries(scoreRanges).map(([range, count]) => ({
        range,
        count,
        percentage: filteredData.length > 0 ? 
            ((count / filteredData.length) * 100).toFixed(1) : '0.0'
    }));
  };

  const prepareDepartmentScores = () => {
    const deptScores = {};
    filteredData.forEach(student => {
      const dept = student.dept || 'Unknown';
      if (!deptScores[dept]) {
        deptScores[dept] = { total: 0, count: 0 };
      }
      
      // Calculate average score for this student
      let studentTotal = 0;
      let studentCount = 0;
      
      if (student.scores) {
        for (const sem in student.scores) {
          for (const subject in student.scores[sem]) {
            studentTotal += student.scores[sem][subject];
            studentCount++;
          }
        }
      }
      
      const studentAvg = studentCount > 0 ? studentTotal / studentCount : 0;
      
      deptScores[dept].total += studentAvg;
      deptScores[dept].count++;
    });

    return Object.entries(deptScores).map(([dept, { total, count }]) => ({
      department: dept,
      averageScore: count > 0 ? (total / count).toFixed(1) : 0,
      studentCount: count
    }));
  };

  const prepareScoreTrends = () => {
    const batchScores = {};
    filteredData.forEach(student => {
      const batch = student.batch || 'Unknown';
      if (!batchScores[batch]) {
        batchScores[batch] = { total: 0, count: 0 };
      }
      
      // Calculate average score for this student
      let studentTotal = 0;
      let studentCount = 0;
      
      if (student.scores) {
        for (const sem in student.scores) {
          for (const subject in student.scores[sem]) {
            studentTotal += student.scores[sem][subject];
            studentCount++;
          }
        }
      }
      
      const studentAvg = studentCount > 0 ? studentTotal / studentCount : 0;
      
      batchScores[batch].total += studentAvg;
      batchScores[batch].count++;
    });

    return Object.entries(batchScores)
      .map(([batch, { total, count }]) => ({
        batch,
        averageScore: count > 0 ? parseFloat((total / count).toFixed(1)) : 0,
        studentCount: count
      }))
      .sort((a, b) => a.batch.localeCompare(b.batch));
  };

  const prepareTopPerformers = () => {
    return filteredData
      .map(student => {
        // Calculate average score for this student
        let totalScore = 0;
        let subjectCount = 0;
        
        if (student.scores) {
          for (const sem in student.scores) {
            for (const subject in student.scores[sem]) {
              totalScore += student.scores[sem][subject];
              subjectCount++;
            }
          }
        }
        
        const avgScore = subjectCount > 0 ? totalScore / subjectCount : 0;
        
        return {
          name: student.name || 'Unknown',
          score: avgScore,
          department: student.dept || 'Unknown'
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const scoreDistribution = prepareScoreDistribution();
  const departmentScores = prepareDepartmentScores();
  const scoreTrends = prepareScoreTrends();
  const topPerformers = prepareTopPerformers();

  if (filteredData.length === 0 && data.students.length === 0) {
    return (
      <div className={styles.centeredElement}>
        <Logo />
        <LogoutButton />
        <div className={styles.noDataContainer}>
          <h2>No data Present</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.centeredElement}>
      <Logo />
      <LogoutButton />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Score Analysis Dashboard</h1>
          <FilterButton 
            onClick={() => setShowFilter(!showFilter)}
            isActive={showFilter}
          />
        </div>
        

        {/* Filter Modal */}
        {showFilter && (
          <div className={styles.filterModal}>
            <div className={styles.filterContent}>
              <div className={styles.filterHeader}>
                <h3>Filter Options</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowFilter(false)}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.filterOptions}>
                <div className={styles.filterGroup}>
                  <label>Batch:</label>
                  <select 
                    value={filters.batch} 
                    onChange={(e) => handleFilterChange('batch', e.target.value)}
                  >
                    <option value="">All Batches</option>
                    {getUniqueValues('batch', filters).map(batch => (
                      <option key={batch} value={batch}>{batch}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Department:</label>
                  <select 
                    value={filters.department} 
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {getUniqueValues('department', filters).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Student:</label>
                  <select 
                    value={filters.student} 
                    onChange={(e) => handleFilterChange('student', e.target.value)}
                  >
                    <option value="">All Students</option>
                    {getUniqueValues('name', filters).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  className={styles.clearButton}
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.chartsGrid}>
          {/* Pie Chart - Score Distribution */}
          <div className={styles.chartCard}>
            <h3>Score Distribution</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="70%" height={300}>
               <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${range}: ${percentage}%`}
                  outerRadius={80}
                  innerRadius={40} 
                  fill="#8884d8"
                  dataKey="count"
                  paddingAngle={5}
                  minAngle={10} 
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} students (${props.payload.percentage}%)`,
                    props.payload.range
                  ]}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
              </PieChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                {scoreDistribution.map((entry, index) => (
                  <div key={entry.range} className={styles.legendItem}>
                    <span 
                      className={styles.legendColor}
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span>{entry.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart - Department Average Scores */}
          <div className={styles.chartCard}>
            <h3>Department Average Scores</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="70%" height={300}>
                <BarChart data={departmentScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averageScore" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }}></span>
                  <span>Average Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Chart - Score Trends by Batch */}
          <div className={styles.chartCard}>
            <h3>Score Trends by Batch</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="70%" height={300}>
                <LineChart data={scoreTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="batch" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="averageScore" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#22c55e' }}></span>
                  <span>Average Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Area Chart - Top Performers */}
          <div className={styles.chartCard}>
            <h3>Top Performers</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="70%" height={300}>
                <AreaChart data={topPerformers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#06b6d4" 
                    fill="#06b6d4"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#06b6d4' }}></span>
                  <span>Student Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
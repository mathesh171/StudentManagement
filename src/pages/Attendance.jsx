import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';
import Logo from '../components/Logo';
import LogoutButton from '../components/LogoutButton';
import styles from '../styles/Attendance.module.css';
import FilterButton from '../components/FilterButton';


const Attendance = () => {
  const [data, setData] = useState({ students: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    batch: '',
    department: '',
    student: ''
  });

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

  const getUniqueValues = (field) => {
    return [...new Set(data.students.map(item => {
      if (field === 'department') return item.dept;
      return item[field];
    }))].filter(Boolean);
  };

  const prepareAttendanceDistribution = () => {
    const attendanceRanges = {
      '90-100%': 0,
      '80-89%': 0,
      '70-79%': 0,
      '60-69%': 0,
      'Below 60%': 0
    };

    filteredData.forEach(student => {
      if (!student.attendance) return;
      
      const totalDays = Object.keys(student.attendance).length;
      const presentDays = Object.values(student.attendance).filter(a => a === 'P').length;
      const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
      
      if (percentage >= 90) attendanceRanges['90-100%']++;
      else if (percentage >= 80) attendanceRanges['80-89%']++;
      else if (percentage >= 70) attendanceRanges['70-79%']++;
      else if (percentage >= 60) attendanceRanges['60-69%']++;
      else attendanceRanges['Below 60%']++;
    });

    return Object.entries(attendanceRanges).map(([range, count]) => ({
      range,
      count,
      percentage: filteredData.length > 0 ? ((count / filteredData.length) * 100).toFixed(1) : '0.0'
    }));
  };

  const prepareDepartmentAttendance = () => {
    const deptAttendance = {};
    filteredData.forEach(student => {
      const dept = student.dept || 'Unknown';
      if (!deptAttendance[dept]) {
        deptAttendance[dept] = { total: 0, count: 0 };
      }
      
      if (student.attendance) {
        const totalDays = Object.keys(student.attendance).length;
        const presentDays = Object.values(student.attendance).filter(a => a === 'P').length;
        const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
        
        deptAttendance[dept].total += percentage;
        deptAttendance[dept].count++;
      }
    });

    return Object.entries(deptAttendance).map(([dept, { total, count }]) => ({
      department: dept,
      averageAttendance: count > 0 ? (total / count).toFixed(1) : 0,
      studentCount: count
    }));
  };

  const prepareAttendanceTrends = () => {
    const batchAttendance = {};
    filteredData.forEach(student => {
      const batch = student.batch || 'Unknown';
      if (!batchAttendance[batch]) {
        batchAttendance[batch] = { total: 0, count: 0 };
      }
      
      if (student.attendance) {
        const totalDays = Object.keys(student.attendance).length;
        const presentDays = Object.values(student.attendance).filter(a => a === 'P').length;
        const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
        
        batchAttendance[batch].total += percentage;
        batchAttendance[batch].count++;
      }
    });

    return Object.entries(batchAttendance)
      .map(([batch, { total, count }]) => ({
        batch,
        averageAttendance: count > 0 ? parseFloat((total / count).toFixed(1)) : 0,
        studentCount: count
      }))
      .sort((a, b) => a.batch.localeCompare(b.batch));
  };

  const prepareTopAttendees = () => {
    return filteredData
      .map(student => {
        let percentage = 0;
        if (student.attendance) {
          const totalDays = Object.keys(student.attendance).length;
          const presentDays = Object.values(student.attendance).filter(a => a === 'P').length;
          percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
        }
        
        return {
          name: student.name || 'Unknown',
          attendance: percentage,
          department: student.dept || 'Unknown'
        };
      })
      .sort((a, b) => b.attendance - a.attendance)
      .slice(0, 10);
  };

  const attendanceDistribution = prepareAttendanceDistribution();
  const departmentAttendance = prepareDepartmentAttendance();
  const attendanceTrends = prepareAttendanceTrends();
  const topAttendees = prepareTopAttendees();

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
            <h1>Attendance Analysis Dashboard</h1>
            <FilterButton 
                onClick={() => setShowFilter(!showFilter)}
                isActive={showFilter}
            />
        </div>

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
                    {getUniqueValues('batch').map(batch => (
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
                    {getUniqueValues('department').map(dept => (
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
                    {getUniqueValues('name').map(name => (
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
          <div className={styles.chartCard}>
            <h3>Attendance Distribution</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="70%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceDistribution}
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
                    {attendanceDistribution.map((entry, index) => (
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
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                {attendanceDistribution.map((entry, index) => (
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

          <div className={styles.chartCard}>
            <h3>Department Average Attendance</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="70%" height={300}>
                <BarChart data={departmentAttendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averageAttendance" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }}></span>
                  <span>Average Attendance</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3>Attendance Trends by Batch</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="70%" height={300}>
                <LineChart data={attendanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="batch" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="averageAttendance" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#22c55e' }}></span>
                  <span>Average Attendance</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3>Top Attendees</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="70%" height={300}>
                <AreaChart data={topAttendees}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#06b6d4" 
                    fill="#06b6d4"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#06b6d4' }}></span>
                  <span>Attendance Percentage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
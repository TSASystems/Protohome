
 var colors = ['#2B3C53']; 

// Daily Report 
  var dailyLChart = document.getElementById('dailyLineChart');
  var dailyBChart = document.getElementById('dailyBarChart');

  

  var randomData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 700) + 1); //placeholder data

  var dailyChartData = {
      labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
      datasets: [{
          data: randomData,
          label: 'Energy Usage',
          borderColor: colors[0],
          backgroundColor: colors[0],
          borderWidth: 2,
          pointBackgroundColor: colors[0]
      }]
  };

  

  new Chart(dailyLChart, {
      type: 'line',
      data: dailyChartData,
      options: { maintainAspectRatio: false }
  });

  new Chart(dailyBChart, {
      type: 'bar',
      data: dailyChartData,
      options: { maintainAspectRatio: false }
  });



  // Weekly report 

  var weeklyLChart = document.getElementById('weeklyLineChart');
  var weeklyBChart = document.getElementById('weeklyBarChart');

  

  var weeklyRandomData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 700) + 1); //placeholder data

  var weeklyChartData = {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      datasets: [{
          data: weeklyRandomData,
          label: ' Average Energy Usage',
          borderColor: colors[0],
          backgroundColor: colors[0],
          borderWidth: 2,
          pointBackgroundColor: colors[0]
      }]
  };

  

  new Chart(weeklyLChart, {
      type: 'line',
      data: weeklyChartData,
      options: { maintainAspectRatio: false }
  });

  new Chart(weeklyBChart, {
      type: 'bar',
      data: weeklyChartData,
      options: { maintainAspectRatio: false }
  });



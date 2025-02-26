var colors = ['#2B3C53'];
var randomData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 700) + 1);
var chLine = document.getElementById("lineChart");
var chartData = {
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


new Chart(lineChart, {
  type: 'line',
  data: chartData,
  options: {
    plugins: {
      legend: {
        display: true, 
        onClick: () => {} 
      
      }
    }
  }
});

new Chart(barChart, {
  type: 'bar',
  data: chartData,
  options: {
    plugins: {
      legend: {
        display: true, 
        onClick: () => {} 
      
      }
    }
  }
});

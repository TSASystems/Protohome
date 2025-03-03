
 var colors = ['#2B3C53']; 

// Daily Report 
  var dailyLChart = document.getElementById('dailyLineChart');
  var dailyBChart = document.getElementById('dailyBarChart');

  

  var randomData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 700) + 1); //placeholder data
  var hoursArray = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]

  // highest energy

  var highestEnergy = 0;
  var highestHour = "";

   for (let i = 0; i < randomData.length; i++) {

         if (highestEnergy < randomData[i] ) {
            highestEnergy = randomData[i];
            highestHour = hoursArray[i];
         }

         

   }

   let highestDailyHour = document.querySelector(".highestDailyHourContainer h2");

    highestDailyHour.textContent = highestEnergy + ' W at ' + highestHour;


 //lowest energy

   var lowestEnergy = highestEnergy;
   var lowestHour = "";

  
   for (let i = 0; i < randomData.length; i++) {

    if (lowestEnergy > randomData[i] ) {
       lowestEnergy = randomData[i];
       lowestHour = hoursArray[i];
    }

    let lowestDailyHour = document.querySelector(".lowestDailyHourContainer h2");

    lowestDailyHour.textContent = lowestEnergy + ' W at ' + lowestHour;


}

 // daily cost calculation 

 var dailyWatts = 0
  var costOfWatt = 0.02486 
  var dailyCost = 0.0;

  for (let i = 0; i < randomData.length; i++) {

         dailyWatts = dailyWatts + randomData[i];
   }

 // needs to be converted into money format
   dailyCost = dailyWatts * costOfWatt;
   console.log(dailyCost);






  var dailyChartData = {
      labels: [ hoursArray[0], hoursArray[1],  hoursArray[2], hoursArray[3], hoursArray[4], hoursArray[5],hoursArray[6], hoursArray[7], hoursArray[8], hoursArray[9],hoursArray[10], hoursArray[11],hoursArray[12],hoursArray[13],hoursArray[14],hoursArray[15],hoursArray[16],hoursArray[17],hoursArray[18],hoursArray[19], hoursArray[20], hoursArray[21], hoursArray[22], hoursArray[23] ], 
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



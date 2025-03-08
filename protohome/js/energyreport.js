var colors = ['#2B3C53'];


var dailyChartCanvas = document.getElementById('dailyChart');
var weeklyChartCanvas = document.getElementById("weeklyChart");

// Generates random placeholder data
var randomData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000) + 1);
var hoursArray = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

var highestEnergy = 0;
var highestHour = 0;

for (let i = 1; i < randomData.length; i++) {
    if (randomData[i] > highestEnergy) {
        highestEnergy = randomData[i];
        highestHour = hoursArray[i];
    }
}


let highestDailyHour = document.querySelector(".highestDailyHourContainer h2");
highestDailyHour.textContent = highestEnergy + ' W at ' + highestHour;

var lowestEnergy = highestEnergy;
var lowestHour = 0;

for (let i = 1; i < randomData.length; i++) {
    if (randomData[i] < lowestEnergy) {
        lowestEnergy = randomData[i];
        lowestHour = hoursArray[i];
    }
}

let lowestDailyHour = document.querySelector(".lowestDailyHourContainer h2");
lowestDailyHour.textContent = lowestEnergy + ' W at ' + lowestHour;


// Daily cost calculation
var dailyKWatts = 0
var costOfHourlyKW = 0.27
var dailyCost = 0.0;
var estimateCost = 0.0; // test variable

for (let i = 0; i < randomData.length; i++) {

       dailyKWatts = dailyKWatts +( randomData[i] / 1000);

 }


 dailyCost = dailyKWatts * costOfHourlyKW;      
 dailyCost = parseFloat(dailyCost);
 dailyCost = dailyCost.toFixed(2);

 let dailyCostEstimate = document.querySelector(".dailySavingsContainer h2");

  dailyCostEstimate.textContent = " £  " + dailyCost;
 

// Daily chart data
var dailyChartData = {
    labels: hoursArray,
    datasets: [{
        data: randomData,
        label: 'Energy Usage',
        borderColor: colors[0],
        backgroundColor: colors[0],
        borderWidth: 2,
        pointBackgroundColor: colors[0]
    }]
};


var dailyChart = new Chart(dailyChartCanvas, {
    type: 'line',
    data: dailyChartData,
    options: { maintainAspectRatio: false }
});




function convertDailyChart() {

    let newType;
 if (dailyChart.config.type === 'bar') {
    newType = 'line';

 } else {
    newType = 'bar';
 }


  
    dailyChart.destroy();

  
    dailyChart = new Chart(dailyChartCanvas, {
        type: newType,
        data: dailyChartData,
        options: { maintainAspectRatio: true}
    });
}

function dailyChartResize(currentType) {
    dailyChart.destroy();

    dailyChart = new Chart(dailyChartCanvas, {
        type: currentType, 
        data: dailyChartData,
        options: { maintainAspectRatio: true }
    });
}


window.addEventListener("resize", function() {
    dailyChartResize(dailyChart.config.type);
});


// Weekly Report
var weeklyChart = document.getElementById('weeklyLineChart');



var weeklyRandomData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 700) + 1);


var weeklyChartData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [{
        data: weeklyRandomData,
        label: 'Average Energy Usage',
        borderColor: colors[0],
        backgroundColor: colors[0],
        borderWidth: 2,
        pointBackgroundColor: colors[0]
    }]
};


var weeklyChart = new Chart(weeklyChartCanvas, {
    type: 'line',
    data: weeklyChartData,
    options: { maintainAspectRatio: false }
});


function convertWeeklyChart() {
   
    let newWeeklyType;
    if (weeklyChart.config.type === 'bar') {
       newWeeklyType = 'line';
   
    } else {
       newWeeklyType = 'bar';
    }

  
    weeklyChart.destroy();

  
    weeklyChart = new Chart(weeklyChartCanvas, {
        type: newWeeklyType,
        data: weeklyChartData,
        options: { maintainAspectRatio: true}
    });
}


function weeklyChartResize(currentType) {
    weeklyChart.destroy();

    weeklyChart = new Chart(weeklyChartCanvas, {
        type: currentType, 
        data: weeklyChartData,
        options: { maintainAspectRatio: true }
    });
}


window.addEventListener("resize", function() {
    weeklyChartResize(weeklyChart.config.type);
});



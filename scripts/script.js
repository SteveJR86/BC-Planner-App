// check localstorage to see if data for day is already saved
// update timeblocks with data from local storage if appropriate

// global variable for current date
let currentDate = moment();

function renderRow(hourDisplay){
  // function to render a single row in the timeblock taking a moment.js object as the hour which
  // this row represents
  let hour = $('<h2>');
  hour.text(hourDisplay.format('ha'));
  hour.addClass('hour');
  let description = $('<textarea cols="35">')
  // add id for saving and formatting as past present or future later
  description.attr('id', hourDisplay.format('H'));
  description.addClass('description'); 
  let saveBtn = $('<i>');
  // add data attribute to identify which element is clicked
  saveBtn.attr('data-hour', hourDisplay.format('H'));
  saveBtn.addClass('fas fa-save saveBtn');
  let row = $('<div>');
  row.addClass('row');
  row.append(hour, description, saveBtn);
  $('.time-block').append(row);
}

function renderTimeBlock(startTime, endTime){
  // function that takes a startTime and endTime as integers between 0 and 23 and displays a row
  // for each hour
  for(let i=startTime; i < endTime+1; i++){
    // turn current i into a moment object with the hour set to i
    let timeForRow = moment().set({hour: i, minutes: 0, seconds: 0, milliseconds: 0});
    renderRow(timeForRow);
  }
}

function saveDetails(event){
  // function to save details when save icon is clicked
  // only act on clicking <i> element
  if(event.target.nodeName === 'I'){
    // get which hour was clicked and turn it into ID name
    let clickedHour = event.target.getAttribute('data-hour');
    let clickedHourId = "#" + clickedHour;
    // get text from textarea
    let textToSave = $(clickedHourId).val();
    // get current localstorage data
    let plannerData = window.localStorage.getItem('plannerData');
    plannerData = JSON.parse(plannerData);
    // check if data exists and is for today
    if(!plannerData || plannerData.date!=currentDate.format('DD-MM-YYYY')){
      plannerData = {};
      plannerData.date = currentDate.format('DD-MM-YYYY');
    }
    plannerData[clickedHour] = textToSave;
    window.localStorage.setItem('plannerData', JSON.stringify(plannerData));
  }
}

function loadDetails(){
  // function to load saved data into timeblocks if present
  let plannerData = window.localStorage.getItem('plannerData');
  plannerData = JSON.parse(plannerData);
  if(plannerData){
    if(plannerData.date === currentDate.format('DD-MM-YYYY')){
      jQuery.each($('textarea'), function(i){
        let currentHourRow = $('textarea')[i];
        $('#' + currentHourRow.getAttribute('id')).val(plannerData[currentHourRow.getAttribute('id')]);
      });
    }
  }
}

$(document).ready(function(){
  // set current date at top of page
  $('#currentDay').text(currentDate.format('dddd, MMMM Do'));
  // render time block area with rows as required
  renderTimeBlock(9, 17);
  setPastPresentFuture();
  loadDetails();
});

$('.time-block').on('click', saveDetails);

function setPastPresentFuture(){
  // function to format rows depending on whether they are past, present or future
  // get all rows with class description
  let timeRows = $('.description');
  // use jQuery each to loop through rows
  timeRows.each(function(){
    // this refers to the current row
    let currentRow = $( this );
    // gets the hour that the current row represents from the id and parses it as an int
    let currentRowHour = parseInt(currentRow.attr('id'));
    // gets the current time formatted as just hours and parses it as an int
    let currentTime = parseInt(moment().format('H'));
  // if else block to check if hour of current row is before, equal to or after the current time
  if(currentRowHour < currentTime){
    currentRow.addClass('past');
    currentRow.removeClass('present');
  } else if (currentRowHour===currentTime) {
    currentRow.addClass('present');
    currentRow.removeClass('future');
  } else {
    currentRow.addClass('future');
  }
  });
}

// refresh background colour of rows every minute 
setInterval(setPastPresentFuture, 1000*60);
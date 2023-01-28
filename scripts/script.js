// check localstorage to see if data for day is already saved
// update timeblocks with data from local storage if appropriate
// update background color of timeblocks for current timeblock and future timeblocks

function renderRow(hourDisplay){
  // function to render a single row in the timeblock taking a moment.js object as the hour which
  // this row represents
  let hour = $('<h2>');
  hour.text(hourDisplay.format('ha'));
  hour.addClass('hour');
  // description alters which classes are added depending on whether the hour is past, present
  // or future
  let description = $('<textarea cols="35">')
  description.addClass('description');
  let currentTime = moment().set({minutes: 0, seconds: 0, milliseconds: 0});
  // if else block to check if hour of current row is before, equal to or after the current time
  if(hourDisplay.isBefore(currentTime)){
    description.addClass('past');
  } else if (hourDisplay.isSame(currentTime)) {
    description.addClass('present');
  } else {
    description.addClass('future');
  }
  let saveBtn = $('<i>');
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

$(document).ready(function(){
  // set current date at top of page
  let currentDate = moment();
  $('#currentDay').text(currentDate.format('dddd, MMMM Do'));
  console.log(moment().set({hour: 9}).format('ha, dddd, MMMM Do'));
  // render time block area with rows as required
  renderTimeBlock(9, 17);
});
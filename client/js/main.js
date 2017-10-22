let numberDays = 7;

let fake_return_json =
  [{date: new Date(2017, 10, 20), sentiment: -3},
   {date: new Date(2017, 10, 17), sentiment: 0},
   {date: new Date(2017, 10, 17), sentiment: 0.4},
   {date: new Date(2017, 10, 18), sentiment: 0.8},
   {date: new Date(2017, 10, 19), sentiment: -0.5},
   {date: new Date(2017, 10, 19), sentiment: 1},
   {date: new Date(2017, 10, 18), sentiment: 0.6},
   {date: new Date(2017, 10, 17), sentiment: 0.2},
   {date: new Date(2017, 10, 19), sentiment: 0},
   {date: new Date(2017, 10, 21), sentiment: -0.6},
   {date: new Date(2017, 10, 20), sentiment: -0.4},
   {date: new Date(2017, 10, 19), sentiment: 0.2},
   {date: new Date(2017, 10, 21), sentiment: 0.8},
   {date: new Date(2017, 10, 19), sentiment: 0.6},
   {date: new Date(2017, 10, 17), sentiment: 0.9},
   {date: new Date(2017, 10, 17), sentiment: -0.1},
   {date: new Date(2017, 10, 17), sentiment: -1},
   {date: new Date(2017, 10, 17), sentiment: -0.4},
   {date: new Date(2017, 10, 19), sentiment: -0.6},
   {date: new Date(2017, 10, 17), sentiment: 0.8},
   {date: new Date(2017, 10, 17), sentiment: 1},
   {date: new Date(2017, 10, 19), sentiment: -0.2},
   {date: new Date(2017, 10, 21), sentiment: 0.6},
   {date: new Date(2017, 10, 20), sentiment: 0.7},
   {date: new Date(2017, 10, 18), sentiment: 0.2}]

///
// Stitching everything together
///

$(document).ready(initialize);
$("#search").click(searchClicked);

function initialize() {
  getListCompanies();
  drawMentionsGraph();
  drawSentimentsGraph();
  $("#mentions-container").hide();
  $("#sentiments-container").hide();
}

function searchClicked() {
  console.log("clicked search");
  $("h1").hide();
  $("#mentions-container").show();
  $("#sentiments-container").show();
  hasCompany();
}

///
// Functions to interface with the back-end
///

function getListCompanies() {
  $.ajax({
    method : "GET",
    url : "http://localhost:3001/api/company"
  })
  .done(function (json) {
    console.log(json);
  });
}

function hasCompany() {
  $.ajax({
    method : "GET",
    url : "http://localhost:3001/api/company?q=" + $("#searchterm").val()
  })
  .done(function (json) {
    console.log(json);
    if (json.length == 0) {
      // TODO: We don't have
    } else {
      getResultsForCompany(json[0].id);
    }
  });
}

function getResultsForCompany(id) {
  $.ajax({
    method : "GET",
    url : "http://localhost:3001/api/mention?company_id=" + id
  })
  .done(function (json) {
    console.log(json);
  });
}

// TODO: Something to listen to submission of company name
// TODO: Respoond to date instead of days ago

///
// Will be called after we get a response from the server
///

function getStatsByDay()
{
  let mention = [];

  for (var i = 0; i < numberDays; i++)
  {
    mention.push({day: i, mentions: 0, sentiments: 0});
  }

  for (var j = 0; j < fake_return_json.length; j++)
  {
    mention[(new Date()).getDate()-fake_return_json[j].date.getDate()].mentions++;
  }

  for (var j = 0; j < fake_return_json.length; j++)
  {
    mention[(new Date()).getDate()-fake_return_json[j].date.getDate()].sentiments += fake_return_json[j].sentiment / mention[(new Date()).getDate()-fake_return_json[j].date.getDate()].mentions;
  }

  return mention;
}

///
// Will be called after the above data is parsed
///

function drawMentionsGraph() {
  // grab the svg
  let svg = d3.select("#mentions-graph");

  // grab its container
  let container = d3.select("#mentions-container");

  // get the array of mentions by day
  totalMentionsByDay = getStatsByDay();

  let height = 500;
  let width;

  svg.attr("style:width", "100%");
  svg.attr("style:height", "" + height + "px");

  container.attr("style:width", "80%");
  container.attr("style:height", "" + height + "px");

  let margins = {"left" : 90, "top" : 10, "right" : 90, "bottom" : 76};
  let buffer = 0;
  width = document.getElementById("mentions-graph").getBoundingClientRect().width;

  // get the maximum number of mentions: need this to set the y-axis
  let maxMentions = 0;
  console.log(totalMentionsByDay);
  for (let i = 0; i < totalMentionsByDay.length; i++)  {
    maxMentions = Math.max(maxMentions, totalMentionsByDay[i].mentions);
  }

  // set-up x-axis and x-values
  let xValue = function(d) { return -d.day;};
  let xScale = d3.scale.linear().domain([-6, 0]).range([margins.left, width - margins.right]);
  let xMap = function(d) { return xScale(xValue(d));};
  let xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0).tickFormat(d3.format("d"));

  // set-up y-axis and y-values
  let yValue = function(d) { return d.mentions};
  let yScale = d3.scale.linear().domain([1.2 * maxMentions, 0]).range([margins.top, height - margins.bottom]);
  let yMap = function(d) {return yScale(yValue(d))};
  let yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

  let radius = 3;
  let color = 0x000000;

  var valueline = d3.svg.line()
    .x(function(d) { return xMap(d); })
    .y(function(d) { return yMap(d); });

  // Draw the x-axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, " + (height - margins.bottom) + ")")
      .call(xAxis)
     .append("text")
      .attr("class", "label")
      .attr("x", width - margins.right)
      .attr("y", 46)
      .style("text-anchor", "end")
      .text("How many days ago?");

  // Draw the y-axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (margins.left - buffer) + ", 0)")
      .call(yAxis)
    .append("text")
     .attr("class", "label")
     .attr("transform", "rotate(-90)")
     .attr("x", -175)
     .attr("y", -42)
     .style("text-anchor", "end")
     .text("No. of Mentions");

  // Draw the data
  svg.selectAll(".dot").data(totalMentionsByDay)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("fill", color)
    .attr("r", radius)
    .attr("cx", xMap)
    .attr("cy", yMap);

  svg.append("path")
      .attr("class", "line")
      .attr("d", valueline(totalMentionsByDay));
}

function drawSentimentsGraph()
{
  // grab the svg
  let svg = d3.select("#sentiments-graph");

  // grab its container
  let container = d3.select("#sentiments-container");

  // get the array of mentions by day
  totalSentimentsByDay = getStatsByDay();

  let height = 500;
  let width;

  svg.attr("style:width", "100%");
  svg.attr("style:height", "" + height + "px");

  container.attr("style:width", "80%");
  container.attr("style:height", "" + height + "px");

  let margins = {"left" : 120, "top" : 10, "right" : 90, "bottom" : 76};
  let buffer = 0;
  width = document.getElementById("sentiments-graph").getBoundingClientRect().width;

  // get the maximum number of mentions: need this to set the y-axis
  let maxSentiments = 0;
  let minSentiments = 0;
  console.log(totalSentimentsByDay);
  for (let i = 0; i < totalSentimentsByDay.length; i++)  {
    console.log(totalSentimentsByDay[i].sentiments);
    minSentiments = Math.min(minSentiments, totalSentimentsByDay[i].sentiments);
    maxSentiments = Math.max(maxSentiments, totalSentimentsByDay[i].sentiments);
  }

  // set-up x-axis and x-values
  let xValue = function(d) { return -d.day; };
  let xScale = d3.scale.linear().domain([-6, 0]).range([margins.left, width - margins.right]);
  let xMap = function(d) { return xScale(xValue(d));};
  let xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0).tickFormat(d3.format("d"));

  console.log(minSentiments);
  console.log(maxSentiments);

  // set-up y-axis and y-values
  let yValue = function(d) { return d.sentiments; };
  let yScale = d3.scale.linear().domain([maxSentiments * 1.2, minSentiments * 1.2]).range([margins.top, height - margins.bottom]);
  let yMap = function(d) {return yScale(yValue(d))};
  let yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(1);

  let radius = 3;
  let color = 0x000000;

  // Define the line
  var valueline = d3.svg.line()
    .x(function(d) { return xMap(d); })
    .y(function(d) { return yMap(d); });

  // Draw the x-axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, " + (height - margins.bottom) + ")")
      .call(xAxis)
     .append("text")
      .attr("class", "label")
      .attr("x", width - margins.right)
      .attr("y", 46)
      .style("text-anchor", "end")
      .text("How many days ago?");

  // Draw the y-axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (margins.left - buffer) + ", 0)")
      .call(yAxis)
    .append("text")
     .attr("class", "label")
     .attr("transform", "rotate(-90)")
     .attr("x", -185)
     .attr("y", -52)
     .style("text-anchor", "end")
     .text("Sentiment");

  // Draw the data
  svg.selectAll(".dot").data(totalSentimentsByDay).enter().append("circle")
    .attr("class", "dot")
    .attr("fill", color)
    .attr("r", radius)
    .attr("cx", xMap)
    .attr("cy", yMap);

  svg.append("path")
     .attr("class", "line")
     .attr("d", valueline(totalSentimentsByDay));
}

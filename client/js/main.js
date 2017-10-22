let numberDays = 7;

let active_data = [];

///
// Stitching everything together
///

$(document).ready(initialize);
$("#search").click(searchClicked);
const ENTER_KEYCODE = 13;
$("#searchterm").keydown((ev) => {
  if ( ev.which == ENTER_KEYCODE || ev.keyCode == ENTER_KEYCODE) {
    searchClicked();
  }
});

function initialize() {
  getListCompanies();
  $("#mentions-container").hide();
  $("#sentiments-container").hide();
}

function searchClicked() {
  $("h1").hide();
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
      active_data = [];
      showNoData();
    } else {
      getActiveData(json[0]._id, json[0].name);
    }
  });
}

function getActiveData(id, name) {
  let date = new Date();

  $.ajax({
    method: "GET",
    url: "http://localhost:3001/api/mention?company_id=" + id
  })
  .done(function (json) {
    console.log(json);
    console.log(id);
    let oldest_date = new Date((date.setDate(date.getDate() - numberDays)));
    active_data = json.filter(function(el) {
      return new Date(el.timestamp) >= oldest_date;
    });

    // TODO: Put this back
    if (active_data.length == 0) {
       showNoData();
    } else {
      console.log("Active data filtered")
      console.log(active_data);
      $("#mentions-container").show();
      $("#sentiments-container").show();
      drawMentionsGraph();
      drawSentimentsGraph();
    }
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

  // TODO: Add filter for company
  for (var i = 0; i < numberDays; i++)
  {
    mention.push({day: i, mentions: 0, sentiments: 0});
  }

  for (var j = 0; j < active_data.length; j++)
  {
    var timeDiff = Math.abs((new Date()).getTime() - new Date(active_data[j].timestamp).getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays > 0 && diffDays < numberDays) {
      mention[diffDays].mentions++;
    }
  }

  for (var j = 0; j < active_data.length; j++)
  {
    var timeDiff = Math.abs((new Date()).getTime() - new Date(active_data[j].timestamp).getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays > 0 && diffDays < numberDays) {
      mention[diffDays].sentiments += (active_data[j].sentiment_score / mention[diffDays].mentions);
    }
  }

  console.log(active_data);
  console.log(mention);
  return mention;
}

///
// Will be called after the above data is parsed
///

function drawMentionsGraph() {
  // grab the svg
  let svg = d3.select("#mentions-graph");
  svg.html("");

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
  for (let i = 0; i < totalMentionsByDay.length; i++)  {
    maxMentions = Math.max(maxMentions, totalMentionsByDay[i].mentions);
  }

  // set-up x-axis and x-values
  let xValue = function(d) { return -d.day;};
  let xScale = d3.scale.linear().domain([-6, 0]).range([margins.left, width - margins.right]);
  let xMap = function(d) { return xScale(xValue(d));};
  let xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0).tickFormat(d3.format("d"))
  .innerTickSize(-width)
  .outerTickSize(0)
  .tickPadding(10);

  // set-up y-axis and y-values
  let yValue = function(d) { return d.mentions};
  let yScale = d3.scale.linear().domain([1.2 * maxMentions, 0]).range([margins.top, height - margins.bottom]);
  let yMap = function(d) {return yScale(yValue(d))};
  let yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(1);

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
      .attr("x", 480)
      .attr("y", 46)
      .style("text-anchor", "end")
      .text("No. of Days back");

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
  svg.html("");

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

  let margins = {"left" : 90, "top" : 10, "right" : 90, "bottom" : 76};
  let buffer = 0;
  width = document.getElementById("sentiments-graph").getBoundingClientRect().width;

  // get the maximum number of mentions: need this to set the y-axis
  let maxSentiments = 0;
  let minSentiments = 0;
  for (let i = 0; i < totalSentimentsByDay.length; i++)  {
    minSentiments = Math.min(minSentiments, totalSentimentsByDay[i].sentiments);
    maxSentiments = Math.max(maxSentiments, totalSentimentsByDay[i].sentiments);
  }

  // set-up x-axis and x-values
  let xValue = function(d) { return -d.day; };
  let xScale = d3.scale.linear().domain([-6, 0]).range([margins.left, width - margins.right]);
  let xMap = function(d) { return xScale(xValue(d));};
  let xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0).tickFormat(d3.format("d"))
  .innerTickSize(-width)
  .outerTickSize(0)
  .tickPadding(10);

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
      .attr("x", 480)
      .attr("y", 46)
      .style("text-anchor", "end")
      .text("No. of Days back");

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

function showNoData() {
  window.alert("No data for this company :(");
  active_data = [];
  $("#mentions-container").hide();
  $("#sentiments-container").hide();
}

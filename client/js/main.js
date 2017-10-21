let numberDays = 7;

let fake_return_json =
  [{daysAgo: 0, sentiment: -0.3},
   {daysAgo: 2, sentiment: 0},
   {daysAgo: 3, sentiment: 0.4},
   {daysAgo: 4, sentiment: 0.8},
   {daysAgo: 2, sentiment: -0.5},
   {daysAgo: 1, sentiment: 1},
   {daysAgo: 3, sentiment: 0.6},
   {daysAgo: 4, sentiment: 0.2},
   {daysAgo: 5, sentiment: 0},
   {daysAgo: 6, sentiment: -0.6},
   {daysAgo: 6, sentiment: -0.4},
   {daysAgo: 3, sentiment: 0.2},
   {daysAgo: 2, sentiment: 0.8},
   {daysAgo: 5, sentiment: 0.6},
   {daysAgo: 6, sentiment: 0.9},
   {daysAgo: 1, sentiment: -0.1},
   {daysAgo: 0, sentiment: -1},
   {daysAgo: 2, sentiment: -0.4},
   {daysAgo: 3, sentiment: -0.6},
   {daysAgo: 5, sentiment: 0.8},
   {daysAgo: 1, sentiment: 1},
   {daysAgo: 0, sentiment: -0.2},
   {daysAgo: 2, sentiment: 0.6},
   {daysAgo: 2, sentiment: 0.7},
   {daysAgo: 3, sentiment: 0.2}]

///
// Stitching everything together
///

$(document).ready(initialize);
$("#search").click(searchClicked);

function initialize() {
  getListCompanies();
  drawMentionsGraph();
}

function searchClicked() {
  $("#header").hide();
}

///
// Functions to interface with the back-end
///

function getListCompanies() {
  $.ajax({
    method : "GET",
    url : "localhost:3001/api/company"
  });
}

function getMentionsCompany()
{
}

// TODO: Something to listen to submission of company name

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
    mention[fake_return_json[j].daysAgo].mentions++;
  }

  for (var j = 0; j < fake_return_json.length; j++)
  {
    mention[fake_return_json[j].daysAgo].sentiments += fake_return_json[j].sentiment / mention[fake_return_json[j].daysAgo].mentions;
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

  // TODO: fix these exact numbers
  let margins = {"left" : 120, "top" : 10, "right" : 90, "bottom" : 76};
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
  let yScale = d3.scale.linear().domain([maxMentions, 0]).range([margins.top, height - margins.bottom]);
  let yMap = function(d) {return yScale(yValue(d))};
  let yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

  let radius = 4;
  let color = 0x000000;

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
      .call(yAxis);

  // Draw the data
  svg.selectAll(".dot")
    .data(totalMentionsByDay)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("fill", color)
    .attr("r", radius)
    .attr("cx", xMap)
    .attr("cy", yMap);
}

// TODO: fill this in by analogy, based on the above function
function drawSentimentsGraph() {
  // grab the svg
  let svg = d3.select("#sentiments-graph")
  averageSentimentByDay = getStatsByDay();
}

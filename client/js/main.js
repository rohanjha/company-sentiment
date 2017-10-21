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
   {daysAgo: 7, sentiment: -0.4},
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
  drawMentionsGraph();
}

function searchClicked() {
  // TODO: Get rid of the title bar
}

// TODO: Something to listen to submission of company name

///
// Will be called after we get a response from the server
///

function getTotalMentionsByDay()
{
  mention;
  for (var j = 0; j < fake_return_json.length; i++)
  {
    if(!mention[fake_return_json[j].daysAgo])
    {
      mention.push({day: 0, mentions:0; sentiments = 0})
      mention[fake_return_json[j].daysAgo].day = fake_return_json[j].daysAgo;
    }
    mention[fake_return_json[j].daysAgo].mentions++;
  }
  return mention;
}

function getAverageSentimentByDay()
{
  sentiment;
  for (var j = 0; j < fake_return_json.length; i++)
  {
    if(!sentiment[fake_return_json[j].daysAgo])
    {
      sentiment.push({day: 0, sentiments = 0})
      sentiment[fake_return_json[j].daysAgo].day = fake_return_json[j].daysAgo;
    }
    sentiment[fake_return_json[j].daysAgo].sentiments += fake_return_json[j].sentiment/fake_return_json[j].mentions;
  }
  return sentiment;
}

function getListCompanies()
{
  fetch(url) // Call the fetch function passing the url of the API as a parameter
  .then(resp) => resp.json())
  .then(function()
  {
    return resp;
  })
  .catch(function() {
    return "We don't have enough data on this company.";
  });
}

function getMentionsCompany()
{
  fetch(url) // Call the fetch function passing the url of the API as a parameter
  .then(resp) => resp.json())
  .then(function()
  {
    // Your code for handling the data you get from the API
  })
  .catch(function() {
    // This is where you run code if the server returns any errors
  });

///
// Will be called after the above data is parsed
///

function drawMentionsGraph() {
  // grab the svg
  let svg = d3.select("#mentions-graph");

  // grab its container
  let container = d3.select("#mentions-container");

  // get the array of mentions by day
  totalMentionsByDay = getTotalMentionsByDay();

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
  let xValue = function(d) { return -d.daysAgo; };
  let xScale = d3.scale.linear().domain([-7, 0]).range([margins.left, width - margins.right]);
  let xMap = function(d) { return xScale(xValue(d));};
  let xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0);

  // set-up y-axis and y-values
  let yValue = function(d) { return d.mentions };
  let yScale = d3.scale.linear().domain([maxMentions, 0]).range([margins.top, height - margins.bottom]);
  let yMap = function(d) { return yScale(yValue(d)) };
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
  averageSentimentByDay = getAverageSentimentByDay();
}

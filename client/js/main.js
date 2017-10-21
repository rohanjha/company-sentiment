fake_return_json =
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
}

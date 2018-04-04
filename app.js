var width = 800;
var height = 600;
var padding = 50;
var barPadding = 1;
var filteredData = regionData.filter(d => d.medianAge !== null);

// Create X axis scale based on median ages in filteredData
var xScale = d3.scaleLinear()
               .domain(d3.extent(filteredData, d => d.medianAge))
               .range([padding, width - padding]);

// Create histogram variable which stores returned function
var histogram = d3.histogram()
                  .domain(xScale.domain())
                  .thresholds(xScale.ticks())
                  .value(d => d.medianAge);

// Create bins variabe to store array returned from histogram function
var bins = histogram(filteredData)

// Create Y scale based on frequency of median ages in each bin.
var yScale = d3.scaleLinear()
               .domain([0, d3.max(bins, d => d.length)])
               .range([height - padding, padding]);

/**
 * Create selection of "bar" and pass in bins data.
 * Then create a "g" element for each bin with a class of "bar"
 */

var svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height);


svg
  .selectAll("rect")
  .data(bins)
  .enter()
  .append("rect")
    .attr("x", d => xScale(d.x0))
    .attr("y", d => yScale(d.length))
    .attr("height", d => height - yScale(d.length) - padding)
    .attr("width", d => xScale(d.x1) - xScale(d.x0) - barPadding )
    .attr("fill", "#9c27b0");

// Create X and Y Axes
var xAxis = d3.axisBottom(xScale)
var yAxis = d3.axisLeft(yScale)

// Format X & Y Axes
d3.select("svg")
  .append("g")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .classed("x-axis", true)
    .call(xAxis);

d3.select("svg")
  .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .classed("y-axis", true)
    .call(yAxis);

// Add axes labels
d3.select("svg")
  .append("text")
    .attr("x", width/2)
    .attr("y", height - 10)
    .attr("font-size", "1.2em")
    .style("text-anchor", "middle")
    .text("Median Age")

d3.select("svg")
  .append("text")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("font-size", "1.2em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Frequency")

d3.select("input")
  .property("value", bins.length)
  .on("input", function(){
    var numBins = +d3.event.target.value;
    histogram.thresholds(xScale.ticks(numBins));
    bins = histogram(filteredData);
    yScale.domain([0, d3.max(bins, d => d.length)]);

  d3.select(".y-axis")
      .call(d3.axisLeft(yScale))

  d3.select(".x-axis")
      .call(d3.axisBottom(xScale)
              .ticks(numBins))
    .selectAll("text")
      .attr("x", 10)
      .attr("y", -3)
      .attr("transform", "rotate(90)")
      .attr("text-anchor", "start")

  var rect = svg
                .selectAll("rect")
                .data(bins);

  rect
    .exit()
    .remove()

  rect
    .enter()
      .append("rect")
    .merge(rect)
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("height", d => height - yScale(d.length) - padding)
      .attr("width", d => {
        var width = xScale(d.x1) - xScale(d.x0) - barPadding
        return width < 0 ? 0 : width
      })
      .attr("fill", "#9c27b0");

  d3.select(".bin-count")
      .text(`Number of bins: ${bins.length}`)

})

const margin = { top: 10, right: 50, bottom: 80, left: 80 };
const width = 1000;
const height = 500;
const svg = d3.select("#fertility-rate-graph")
 .append("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
 .append("g")
 .attr("transform", `translate(${margin.left},${margin.top})`);

let xScale, yScale, colorScale;

 // Tooltip
 const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("https://raw.githubusercontent.com/MinhTris1705/DSDV-Project-demo/main/datasets/Fertility_rate.csv").then(function(data) {
    const initialYear = "2017";
    const filteredData = data.filter(d => d.Year === initialYear);
    createChart(filteredData);
});

d3.select("#year-dropdown")
.on("change", function() {
    const selectedYear = d3.select(this).property("value");
    updateChart(selectedYear);
  });

function updateChart(selectedYear) {
  d3.csv("https://raw.githubusercontent.com/MinhTris1705/DSDV-Project-demo/main/datasets/Fertility_rate.csv")
  .then(function(data) {
      const filteredData = data.filter(d => d.Year === selectedYear);
      // updateScales(filteredData);
      updateBars(filteredData);
    });
}

function createChart(data) {
  yScale = d3.scaleBand()
  .domain(data.map(d => d.Entity))
  .range([height - margin.bottom, margin.top])
  .padding(0.1);

  const maxFertilityRate = d3.max(data, d => parseFloat(d["Fertility rate - Sex: all - Age: all - Variant: estimates"]));
  xScale = d3.scaleLinear()
  .domain([0, maxFertilityRate])
  .range([margin.left, width - margin.right]);

  colorScale = d3.scaleOrdinal()
  .domain(data.map(d => d.Entity))
  .range(d3.schemeCategory10);

  svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => margin.left)
  .attr("y", d => yScale(d.Entity))
  .attr("width", d => xScale(parseFloat(d["Fertility rate - Sex: all - Age: all - Variant: estimates"])))
  .attr("height", yScale.bandwidth())
  .call(d3.axisBottom(xScale))
  .attr("fill", d => colorScale(d.Entity))
  .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Country: " + d.Entity + "<br/>Fertility Rate: " + d["Fertility rate - Sex: all - Age: all - Variant: estimates"])
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

  svg.append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(d3.axisLeft(yScale));

  svg.append("g")
  // .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(xScale));
}

function updateScales(data) {
  const maxFertilityRate = d3.max(data, d => parseFloat(d["Fertility rate - Sex: all - Age: all - Variant: estimates"]));
  xScale.domain([0, maxFertilityRate]);
  yScale.domain(data.map(d => d.Entity));
}

function updateBars(data) {
  const barSelection = svg.selectAll("rect")
  .data(data);

  barSelection.exit().remove();

  barSelection.enter()
  .append("rect")
  .merge(barSelection)
  .transition()
  .duration(1000)
  .attr("x", d => margin.left)
  .attr("y", d => yScale(d.Entity))
  .attr("width", d => xScale(parseFloat(d["Fertility rate - Sex: all - Age: all - Variant: estimates"])))
  .attr("height", yScale.bandwidth())
  .attr("fill", d => colorScale(d.Entity))
  .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Country: " + d.Entity + "<br/>Fertility Rate: " + d["Fertility rate - Sex: all - Age: all - Variant: estimates"])
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}
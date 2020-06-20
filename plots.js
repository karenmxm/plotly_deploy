function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      // Build the table when the page loads
      optionChanged(sampleNames[0]);
  })}

  init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      console.log(resultArray);
      var result = resultArray[0];
      console.log(result);
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      Object.entries(result).forEach(([key,value]) => {
        console.log(key,value)
        PANEL.append("h6").text(key+": " + value);
      });
    });
  }

  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var sampledata = data.samples;
      var sampleArray = sampledata.filter(sampleObj => sampleObj.id == sample);
      // console.log(sampleArray);
      var samples = sampleArray[0];
      // console.log(samples);
      
      var sampleValue = samples.sample_values;
      // console.log(sampleValue)

      var sampleLabel = samples.otu_labels;
      // console.log(sampleLabel)

      var sampleId = samples.otu_ids;
      // console.log(sampleId)
      
      // Bar Chart
      var trace = {
        x: sampleValue.slice(0,10),
        y: sampleId.slice(0,10).map(otu_ids => `OTU ${otu_ids}`),       
        text: sampleLabel.slice(0,10),
        type: "bar",
        orientation: "h"
      };

      // Apply the group bar mode to the layout
      var barLayout = {
        margin: {
          l: 150,
          // r: 100,
          t: 50,
          // b: 100
        },
        yaxis: {
          autorange: 'reversed'
        },
      };

    Plotly.newPlot("bar", [trace], barLayout);

      // Bubble Chart
      var traceBubble = {
        x: sampleId,
        y: sampleValue,   
        marker: {
          size: sampleValue,
          color: sampleId,
          colorscale: 'Earth'
        },
        text: sampleLabel,    
        mode: 'markers',
      };

      var bubbleLayout = {
        title: {
          text:"Bacteria Cultures Per Sample",
          },
        xaxis: {
          title: "OTU ID"
          },
        showlegend: false,
        height: 500,
        width: 1100
      };

      Plotly.newPlot('bubble', [traceBubble], bubbleLayout);

      // Gauge Chart
      var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: 270,
          title: { text: "Speed" },
          type: "indicator",
          mode: "gauge+number"
        }
      ];
      
      var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
      
      Plotly.newPlot('gauge', [data], layout);
      
    });

  };



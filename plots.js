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

      console.log("I'm here")

      // Gauge Chart

      // Input wfreq
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      console.log(result)

      var level = 20*result.wfreq;

      // Trig to calc meter point
      var degrees = 180 - level,
          radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
      var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
      // Path: may have to change to create a better triangle
      var mainPath = path1,
          pathX = String(x),
          space = ' ',
          pathY = String(y),
          pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);

      var data = [{ type: 'scatter',
        x: [0], y:[0],
          marker: {size: 14, 
            color:'850000',
            colorscale:'YlGnBu'},
          showlegend: false,
          name: 'speed',
          text: level,
          hoverinfo: 'text+name'},
        { values: [1,1,1,1,1,1,1,1,1,9],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5','3-4','2-3','1-2','0-1',''],
        textinfo: 'text',
        textposition:'inside',
        marker: {
          colors: [
            "rgba(10, 100, 0, .5)",
            "rgba(14, 127, 0, .5)",
            "rgba(15, 140, 0, .5)",
            "rgba(110, 154, 22, .5)",
            "rgba(170, 202, 42, .5)",
            "rgba(202, 209, 95, .5)",
            "rgba(210, 206, 145, .5)",
            "rgba(232, 226, 202, .5)",
            "rgba(255, 255, 255, 0)"
          ]
        },
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];

      var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
          }],
        height: 400,
        width: 400,
        title: '<b>'+'Belly Button Washing Frequency'+ '</b>' + "<br>" + 'Scrub per Week',
        xaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]}
      };

      Plotly.newPlot('gauge', data, layout);
        
    });

  };



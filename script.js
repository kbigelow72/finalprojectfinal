Highcharts.chart("graphic-1", {
  chart: {
    type: "column"
  },
  title: {
    text: "Decline in enrollment: 2019 vs 2021"
  },
  subtitle: {
    text: "Source: National Student Clearinghouse "
  },
  xAxis: {
    categories: [
      "California",
      "New York",
      "Pennsylvania",
      "Michigan",
      "Texas",
      "Kansas"
    ],
    crosshair: true
  },
  yAxis: {
    min: 0,
    title: {
      text: "Enrollment (students)"
    }
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.f} Students</b></td></tr>',
    footerFormat: "</table>",
    shared: true,
    useHTML: true
  },
  plotOptions: {
    column: {
      pointPadding: 0.1,
      borderWidth: 0
    }
  },
  series: [
    {
      name: "2019",
      color: "#512888",
      data: [2246684, 983003, 579489, 466645, 1373986, 169316]
    },
    {
      name: "2020",
      color: "#000000",
      data: [2205743, 959681, 553691, 453631, 1366569, 165372]
    },
    {
      name: "2021",
      color: "#A7A7A7",
      data: [2038175, 899083, 513804, 424459, 1332845, 154963]
    }
  ]
});

Highcharts.getJSON("/enrollment.json", function(data) {
  // Make codes uppercase to match the map data
  data.forEach(function(p) {
    p.code = p.code.toUpperCase();
  });

  // Instantiate the map
  Highcharts.mapChart("graphic-2", {
    chart: {
      map: "countries/us/us-all",
      borderWidth: 1
    },

    title: {
      text: "Total Enrollment 2021"
    },
    subtitle: {
      text: "Source: National Student Clearinghouse",
      y: 72
    },

    exporting: {
      sourceWidth: 600,
      sourceHeight: 500
    },

    legend: {
      layout: "horizontal",
      borderWidth: 0,
      backgroundColor: "rgba(255,255,255,0.85)",
      floating: true,
      verticalAlign: "top",
      y: 15
    },

    mapNavigation: {
      enabled: true
    },

    colorAxis: {
      min: 10000,
      type: "logarithmic",
      minColor: "#FFFFFF",
      maxColor: "#512888",
      stops: [
        [0, "#FFFFFF"],
        [0.25, "#D7bbf1"],
        [0.5, "#b979f7"],
        [0.75, "#6300c7"],
        [1, "#000000"]
      ]
    },

    series: [
      {
        animation: {
          duration: 1500
        },
        data: data,
        joinBy: ["postal-code", "code"],
        dataLabels: {
          enabled: true,
          color: "#FFFFFF",
          format: "{point.code}"
        },
        name: "Total enrollment",
        tooltip: {
          pointFormat: "{point.code}: {point.value}"
        }
      }
    ]
  });
});
$(document).ready(function() {
  const table = $("#dt-table").DataTable();
  const tableData = getTableData(table);
  createHighcharts(tableData);
  setTableEvents(table);

  function getTableData(table) {
    const dataArray = [],
      stateArray = [],
      fourArray = [],
      twoArray = [];

    // loop table rows
    table.rows({ search: "applied" }).every(function() {
      const data = this.data();
      stateArray.push(data[0]);
      fourArray.push(parseInt(data[1]));
      twoArray.push(parseInt(data[2]));
    });

    // store all data in dataArray
    dataArray.push(stateArray, fourArray, twoArray);

    return dataArray;
  }

  function createHighcharts(data) {
    Highcharts.setOptions({
      lang: {
        thousandsSep: ","
      }
    });

    Highcharts.chart("chart", {
      title: {
        text: "2021 College Enrollment Rates By State"
      },
      subtitle: {
        text: "Data from National Student Clearingouse"
      },
      xAxis: [
        {
          categories: data[0],
          labels: {
            rotation: -45
          }
        }
      ],
      yAxis: [
        {
          // first yaxis
          title: {
            text: "Enrollment"
          }
        },
        {
          //   secondary yaxis
          title: {
            text: ""
          },
          min: 0,
          opposite: true
        }
      ],
      series: [
        {
          name: "Four-Year Colleges",
          color: "#512888",
          type: "column",
          data: data[1],
          tooltip: {
            valueSuffix: ""
          }
        },

        {
          name: "Two-Year Colleges",
          color: "#A7A7A7",
          type: "column",
          data: data[2],
          yAxis: 1
        }
      ],
      tooltip: {
        shared: true
      },
      legend: {
        backgroundColor: "white",
        shadow: true
      },
      credits: {
        enabled: false
      },
      noData: {
        style: {
          fontSize: "16px"
        }
      }
    });
  }

  let draw = false;

  function setTableEvents(table) {
    // listen for page clicks
    table.on("page", () => {
      draw = true;
    });

    // listen for updates and adjust the chart accordingly
    table.on("draw", () => {
      if (draw) {
        draw = false;
      } else {
        const tableData = getTableData(table);
        createHighcharts(tableData);
      }
    });
  }
});

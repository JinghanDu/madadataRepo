'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Chart = require('react-d3-core').Chart;
var LineChart = require('react-d3-basic').LineChart;
var LineTooltip = require('react-d3-tooltip').LineTooltip;
var BarTooltip = require('react-d3-tooltip').BarTooltip;
var d3 = require("d3");
import _ from 'lodash';
var StockBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
//   // AAPL
// stockName
// MMM
// AXP
// BA
// CAT
// CVX
// CSCO
// KO
// DD
// XOM
// GE
// GS
// HD

  handleStockSubmit: function(stock) {
    $.ajax({
      url: "http://localhost:8000/",
      dataType: 'json',
      type: 'POST',
      data: stock,
      success: function(data) {
        
        if(data === "Not Found") {
          alert("Not Found");
          this.setState({data: this.state.data});
        }
        else {
        this.state.data.push(data);
        console.log(this.state.data);
        this.setState({data: this.state.data});
      }
        
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="stockBox">
       <h2>Choose stocks and see the results.</h2>
        <StockForm onStockSubmit={this.handleStockSubmit}/>
        <StockResult data={this.state.data} /> 
      </div>
    );
  }
});


var StockForm = React.createClass({
    getInitialState: function() {
    return {stockName: ''};
  },
  handleNameChange: function(e) {
    this.setState({stockName: e.target.value});
  },
   handleSubmit: function(e) {
    e.preventDefault();
    var sName = this.state.stockName.trim();
    // if (!sDate|| !sName) {
    //   return;
    // }
    this.props.onStockSubmit({stockName: sName});
    this.setState({stockName: ''});
  },

  render: function() {
    return (
    <div className="stockForm">
	    <form onSubmit = {this.handleSubmit}>
  	  stock<input type="text"  value={this.state.stockName}
          onChange={this.handleNameChange}/>
  	  <input type="submit" name = "submit" value="submit"/>
  	  </form>
   
	 </div>
    );
  }
});


var StockResult = React.createClass({

  render: function() {

    // var stockNodes = _.map(sInfo,sInfo=><Stock stockDate={sInfo.stockDate} key={sInfo.id}> {sInfo.stockName}</Stock>)

    var stockNodes = this.props.data.map(function(sInfo,index) {
      return (
        <Stock 
        stockInfo = {sInfo}
        key = {index}
        >
        </Stock>
        );
      });

    return (
      <div className="stockResult">
     {stockNodes}
      </div>
    );
  }
});


var Stock = React.createClass({

  render: function() {
    // console.log(this.props.stockInfo);
    var width = 900,
    height = 500,
    margins = {left: 100, right: 100, top: 50, bottom: 50},
    low = [],
    high = [],
    vo = [],
    x = function(d) {
      return new Date(d.Date);
    },
    title = this.props.stockInfo[0].stockName,
    xScale = 'time',
    chartSeries = [
      {
        style: {
          "strokeWidth": 2,
          "strokeOpacity": 1
        },
        field: 'Close',
        name: 'Close'
       },
      {
        style: {
        "strokeWidth": 2,
        "strokeOpacity": 1
        },
        field: 'Open',
        name: 'Open'
      },
     {
        style: {
          "strokeWidth": 2,
          "strokeOpacity": 1
        },
        field: 'Low',
        name: 'Low'
      },
    {
        style: {
          "strokeWidth": 2,
          "strokeOpacity": 1
        },
        field: 'High',
        name: 'High'
      }
    ],
    chartSeriesV = [
      {
        style: {
          "strokeWidth": 2,
          "strokeOpacity": 1
        },
        field: 'Volume',
        name: 'Volume'
      }
    ];

    for (var i = 0; i <= this.props.stockInfo.length - 1; i++){
      this.props.stockInfo[i].Volume = parseFloat(this.props.stockInfo[i].Volume);
      this.props.stockInfo[i].Open = parseFloat(this.props.stockInfo[i].Open);
      this.props.stockInfo[i].Close = parseFloat(this.props.stockInfo[i].Close);
      this.props.stockInfo[i].High = parseFloat(this.props.stockInfo[i].High);
      this.props.stockInfo[i].Low = parseFloat(this.props.stockInfo[i].Low);

      low.push(this.props.stockInfo[i].Low);
      high.push(this.props.stockInfo[i].High);
      vo.push(this.props.stockInfo[i].Volume);
    }
    var highMax = d3.max(high),
    lowMin = d3.min(low),
    voMax = d3.max(vo),
    voMin = d3.min(vo),
    y = function(d) {
      return +d;
    },
    xTickFormat = d3.time.format("%m"),
    // find max and min
    yDomain = [lowMin, highMax],
    yDomainV = [voMin, voMax],
    yScale = 'linear';
    console.log(low);
    return (
      <div className="stock">
        <br/>    
        <h2> {title}</h2>
      <LineTooltip
           data= {this.props.stockInfo}
           width= {width}
           height= {height}
           margins= {margins}
           chartSeries= {chartSeries}
           x = {x}
           xScale = {xScale}
           y= {y}
           yDomain= {yDomain}
           yScale = {yScale}
           xTickFormat = {xTickFormat}
         />
       <LineTooltip
        data= {this.props.stockInfo}
        width= {width}
        height= {height}
        margins= {margins}
        chartSeries= {chartSeriesV}
        x= {x}
        xScale= {xScale}
        y= {y}
        yDomain= {yDomainV}
        yScale = {yScale}
        xTickFormat = {xTickFormat}
      />

      </div>
     )
  }
});


ReactDOM.render(
  <StockBox url="http://localhost:8000/"  />,

  document.getElementById('main')
 );


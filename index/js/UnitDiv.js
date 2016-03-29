'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Chart = require('react-d3-core').Chart;
var LineChart = require('react-d3-basic').LineChart;
var LineTooltip = require('react-d3-tooltip').LineTooltip;
var LineZoom = require('react-d3-zoom').LineZoom;
var d3 = require("d3");
import _ from 'lodash';
var StockBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  // loadStocksFromServer: function() {
  //       $.ajax({
  //       url: this.props.url,
  //       dataType: 'json',
  //       cache: false,
  //       success: function(data) {
  //        this.setState({data: data});
  //      }.bind(this),
  //       error: function(xhr, status, err) {
  //        console.error(this.props.url, status, err.toString());
  //       }.bind(this)
  //     });
  //   },
  // componentDidMount: function() {
  //   this.loadStocksFromServer();
  //   //setInterval(this.loadStocksFromServer, this.props.pollInterval);
  // },
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
       <h3>Choose stocks and see the results.</h3>
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
    var width = 800,
    height = 300,
    margins = {left: 100, right: 100, top: 50, bottom: 50},
    low = [],
    high = [],
    vo = [],
    x = function(d) {
      var parseDate = d3.time.format("%Y-%m-%d").parse;
      return parseDate(d.Date);
      // return new Date(d.Date);
    },
    title = this.props.stockInfo[0].stockName,
    xScale = 'time',
    chartSeries = [
      {
        field: 'Close',
        name: 'Close'
       },
      {
        field: 'Open',
        name: 'Open'
      },
     {
        field: 'Low',
        name: 'Low'
      },
    {
        field: 'High',
        name: 'High'
      }
    ],
    chartSeriesV = [
      {
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
      />

      </div>
     )
  }
});


ReactDOM.render(
  <StockBox url="http://localhost:8000/"  />,

  document.getElementById('main')
 );


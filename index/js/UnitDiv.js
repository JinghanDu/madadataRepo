var React = require('react');
var ReactDOM = require('react-dom');

var StockBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadStocksFromServer: function() {
        $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
         this.setState({data: data});
       }.bind(this),
        error: function(xhr, status, err) {
         console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
  componentDidMount: function() {
    this.loadStocksFromServer();
    //setInterval(this.loadStocksFromServer, this.props.pollInterval);
  },
  handleStockSubmit: function(stock) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: stock,
      success: function(data) {
        this.setState({data: data});
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
    return {stockDate: '', stockName: ''};
  },
    handleDateChange: function(e) {
    this.setState({stockDate: e.target.value});
  },
  handleNameChange: function(e) {
    this.setState({stockName: e.target.value});
  },
   handleSubmit: function(e) {
    e.preventDefault();
    var sDate = this.state.stockDate.trim();
    var sName = this.state.stockName.trim();
    if (!sDate|| !sName) {
      return;
    }
    this.props.onStockSubmit({stockDate: sDate, stockName: sName});
    this.setState({stockDate: '', stockName: ''});
  },

  render: function() {
    return (
    <div className="stockForm">
	    <form onSubmit = {this.handleSubmit}>
  	  日期<input type="text" value={this.state.stockDate}
          onChange={this.handleDateChange}/>
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

    var stockNodes = this.props.data.map(function(sInfo) {
      return (
        <Stock stockDate={sInfo.stockDate} key={sInfo.id}>
          {sInfo.stockName}
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
    return (
      <div className="stock">
            You chose {this.props.children} on the date of {this.props.stockDate}.
      </div>
    );
  }
});


ReactDOM.render(
  <StockBox url="http://localhost:3000/data"  />,
  document.getElementById('main')
 );

// $.ajax({
//   type: "GET",
//   url: "./data.json",
//   dataType: "json",
// }).done(function(res){
//   ReactDOM.render(
//     <StockBox data={res} />,
//     document.getElementById('main')
//   );
// });
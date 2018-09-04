import React from 'react';

class Sequencer extends React.Component {  
    state {
        on: false
    }
        
    toggleState = () => {
        this.setState({
            on: !this.state.on
        })
    }
    
  render() {
      const = {this.state.on}
    return (
      <div >
        {this.state.on && <p>tested</p>}
        <button onClick={this.toggleState}>hi {this.state.on}</button>
      </div>
    );
  }
    
};


export default Sequencer
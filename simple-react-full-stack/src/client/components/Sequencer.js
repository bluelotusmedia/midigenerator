import React from 'react'
class Sequencer extends React.Component {
    
    render() {
    return (
      <div className={this.props.className}>
        {this.props.steps.map((step, i) => {
            return <a index={i} key={i} 
                onClick={this.props.onClick.bind(this,i)} 
                className={this.props.stepClasses[i]+" step"}>
               </a>;
        })} 
      </div> 
    );
  }
}

export default Sequencer;
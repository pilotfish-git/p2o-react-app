/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { socketConnect } from '../../redux/modules/socket';
import classes from './HomeView.scss';
import { Motion, spring } from 'react-motion';

export class HomeView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {pressUpdate: false};
  }

  componentWillMount () {
    this.props.socketConnect('00:1B:DC:00:C0:06');
  }

  componentWillReceiveProps (nextProps) {
    this.setState({pressUpdate: true});
    setTimeout(() => {
      this.setState({pressUpdate: false});
    }, 300);
  }

  render () {
    if (!this.props.registered) {
      return (<div className={classes.homeView}>busy registering</div>);
    }
    let button = this.props.button;
    if (!button) {
      return (<div className={classes.homeView}>{`Waiting for button press with id: '${this.props.listeningTo}'`}</div>);
    }
    return (
      <div className={classes.homeView}>
        <div className={classes.header}>{`Button ID: '${button.id}'`}</div>
        <div className={classes.counterContainer}>
          <Motion style={{x: spring(this.state.pressUpdate ? 3 : 1, {stiffness: 150, damping: 8})}}>
            {({x}) =>
              <div className="counter" style={{
                WebkitTransform: `scale(${x})`,
                transform: `scale(${x})`
              }}>{button.cache}</div>
            }
          </Motion>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => state.socket;
export default connect((mapStateToProps), {
  socketConnect
})(HomeView);

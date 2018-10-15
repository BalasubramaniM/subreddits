import React from "react";
import { connect } from "react-redux";
import { APP_LOAD } from "../constants/actionTypes";
import Home from "../components/Home";

const mapStateToProps = state => {
    return {
        appLoaded: state.common.appLoaded,
        appName: state.common.appName,
        data: state.common.data
    };
};

const mapDispatchToProps = dispatch => ({
    onLoad: payload => dispatch({ type: APP_LOAD, payload, skipTracking: true })
});

class App extends React.Component {
    componentWillMount() {
        // this.props.onLoad(agent.Home.all());
    }

    render() {
        return (
            <div>
                <Home appName={this.props.appName} />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

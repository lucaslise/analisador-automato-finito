import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Automato from '../components/Automato';
import GramaticaRegular from '../components/GramaticaRegular';
import { Divider, Row, Col } from 'antd';

class App extends Component {
  state = {
    rules: [],
  };

  handleChangeRules = (rules) => {
    console.warn(rules);
    this.setState({
      ...this.state,
      rules
    })
  }

  render() {
    return (
      <Row gutter={16} style={{ padding: 20 }}>
        <Col xs={12}>
          <Divider>Gramática Regular</Divider>
          <GramaticaRegular onChangeRules={this.handleChangeRules}/>
        </Col>
        <Col xs={12}>
          <Divider>Autômato Finito</Divider>
          <Automato rules={this.state.rules} />
        </Col>
      </Row>
    )
  }
}

App.propTypes = {
}

export default App;

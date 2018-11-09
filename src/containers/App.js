import React, { Component } from 'react';
import {
  Divider, Row, Col, Card,
} from 'antd';
import _ from 'lodash';
import Automato from '../components/Automato';
import GramaticaRegular from '../components/GramaticaRegular';
import Determinizacao from '../components/Determinizacao';
import { isAFND } from '../services/helper';

class App extends Component {
  state = {
    rules: [],
  };

  handleChangeRules = (rules) => {
    this.setState({
      rules,
    });
  }

  render() {
    const rules = _.reject(this.state.rules, rule => _.isEmpty(rule.value));

    return (
      <Row gutter={16} style={{ padding: 20 }}>
        <Col offset={4} xs={16}>
          <Card title="Gramática Regular" bordered={false}>
            <GramaticaRegular onChangeRules={this.handleChangeRules} />
          </Card>
        </Col>
        <Col offset={4} xs={16} style={{ marginTop: 15, display: _.isEmpty(rules) ? 'none' : 'block' }}>
          <Automato rules={rules} />
        </Col>
        <Col offset={4} xs={16} style={{ display: isAFND(rules) ? 'block' : 'none', marginTop: 16 }}>
          <Determinizacao rules={rules} />
        </Col>
      </Row>
    );
  }
}

App.propTypes = {
};

export default App;

import React, { Component } from 'react';
import {
  Divider, Row, Col, Card,
} from 'antd';
import _ from 'lodash';
import Automato from '../components/Automato';
import GramaticaRegular from '../components/GramaticaRegular';
import Determinizacao from '../components/Determinizacao';
import { isAFND } from '../services/helper';
import Examples from '../components/Examples';

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
        <Col xs={24} md={{ span: 6 }}>
          <Card>
            <Examples />
          </Card>
        </Col>
        <Col md={{ span: 18 }} xs={{ span: 24 }}>
          <Card title="Gramática Regular" bordered={false}>
            <GramaticaRegular onChangeRules={this.handleChangeRules} />
          </Card>
        </Col>
        <Col md={{ span: 18 }} xs={{ span: 24 }} style={{ marginTop: 15, display: _.isEmpty(rules) ? 'none' : 'block' }}>
          <Automato rules={rules} />
        </Col>
        <Col md={{ span: 18, offset: 6 }} xs={{ span: 24 }} style={{ marginTop: -15, display: isAFND(rules) ? 'block' : 'none' }}>
          <Determinizacao rules={rules} />
        </Col>
      </Row>
    );
  }
}

App.propTypes = {
};

export default App;

import React, { Component } from 'react';
import {
  Row, Col, Card,
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

    const visibleStyle = {
      marginTop: 15,
      display: isAFND(rules) ? 'block' : 'none',
    };

    const columnsStyle = {
      md: { span: 16 },
      xs: { span: 24 },
    };

    return (
      <Row gutter={16} style={{ padding: 20 }}>
        <Col md={{ span: 8 }} xs={{ span: 24 }}>
          <Card title="Gramática Regular" bordered={false} style={{ marginBottom: 15 }}>
            <GramaticaRegular onChangeRules={this.handleChangeRules} />
          </Card>
          <Examples />
        </Col>
        <Col {...columnsStyle} style={{ display: _.isEmpty(rules) ? 'none' : 'block' }}>
          <Automato rules={rules} />
        </Col>
        <Col {...columnsStyle} style={visibleStyle}>
          <Determinizacao rules={rules} />
        </Col>
      </Row>
    );
  }
}

App.propTypes = {
};

export default App;

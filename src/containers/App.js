import React, { Component } from 'react';
import {
  Divider, Row, Col, Card,
} from 'antd';
import Automato from '../components/Automato';
import GramaticaRegular from '../components/GramaticaRegular';
import Determinizacao from '../components/Determinizacao';
import Minimizacao from '../components/Minimizacao';
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
    const { rules } = this.state;

    return (
      <Row gutter={16} style={{ padding: 20 }}>
        <Col lg={10}>
          <Divider>Entrada</Divider>
          <Card title="Gramática Regular" bordered={false}>
            <GramaticaRegular onChangeRules={this.handleChangeRules} />
          </Card>
        </Col>
        <Col lg={14}>
          <Divider>Saída</Divider>
          <Card title="Autômato Finito" bordered={false}>
            <Automato rules={rules} />
          </Card>
        </Col>
        <Col offset={10} lg={14} style={{ display: isAFND(rules) ? 'block' : 'none', marginTop: 16 }}>
          <Card title="Determinização" bordered={false}>
            <Determinizacao rules={rules} />
          </Card>
        </Col>
        <Col offset={10} lg={14} style={{ display: isAFND(rules) ? 'block' : 'none', marginTop: 16 }}>
          <Card title="Minimização" bordered={false}>
            <Minimizacao rules={rules} />
          </Card>
        </Col>
      </Row>
    );
  }
}

App.propTypes = {
};

export default App;

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Automato from '../components/Automato';
import GramaticaRegular from '../components/GramaticaRegular';
import Determinizacao from '../components/Determinizacao';
import { Divider, Row, Col, Tag, Card } from 'antd';
import { isAFND } from '../services/helper';

class App extends Component {
  state = {
    rules: [],
    afnd: true,
  };

  handleChangeRules = (rules) => {
    this.setState({
      ...this.state,
      rules
    })
  }

  render() {
    const { rules } = this.state;

    return (
      <Row gutter={16} style={{ padding: 20 }}>
        <Col xs={12}>
          <Divider>Entrada</Divider>
          <Card title="Gramática Regular" bordered={false}>
            <GramaticaRegular onChangeRules={this.handleChangeRules}/>
          </Card>
        </Col>
        <Col xs={12}>
          <Divider>Saída</Divider>
          <Card title="Autômato Finito" bordered={false}>
            <Automato rules={rules} />
          </Card>
        </Col>
        <Col offset={12} xs={12} style={{ display: isAFND(rules) ? 'block' : 'none', marginTop: 16 }}>
          <Card title="Determinização" bordered={false}>
            <Determinizacao rules={rules}/>
          </Card>
        </Col>
      </Row>
    )
  }
}

App.propTypes = {
}

export default App;

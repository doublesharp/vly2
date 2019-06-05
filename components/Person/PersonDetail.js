import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Markdown from 'markdown-to-jsx'
import { FormattedMessage } from 'react-intl'
import { Icon, Row, Col } from 'antd'
import styled from 'styled-components'
import PersonRoles from './PersonRole'

const DL = styled.dl`
  display: flex;
  flex-flow: row wrap;
  border: none;
  border-width: 1px 1px 0 0;

dt {
  flex-basis: 20%;
  padding: 2px 4px;
  text-align: right;
}
dd {
  flex-basis: 70%;
  flex-grow: 1;
  margin: 0;
  padding: 2px 4px;

}
`

const PersonDetail = ({ person }, ...props) => (

  <Row type='flex' align='top'>
    <Head title={person.nickname} />
    <Col // these settings put the image first on narrow pages.
      sm={{ span: 24, order: 1 }}
      md={{ span: 12, order: 2 }}
    >
      <img style={{ width: '100%', maxWidth: '300px' }} src={person.avatar} alt={person.nickname} />
    </Col>
    <Col
      sm={{ span: 24, order: 2 }}
      md={{ span: 12, order: 1 }}
    >
      <h1>{person.nickname}</h1>
      <p>{person.name}</p>
      <DL>
        <dt>
          <Icon type='phone' />
        </dt>
        <dd>{person.phone}</dd>
        <dt>
          <Icon type='mail' />
        </dt>
        <dd>{person.email}</dd>
        <dt>
          <Icon type='compass' />
        </dt>
        <dd>{person.gender}</dd>
        <dt>
          <Icon type='schedule' />
        </dt>
        <dd>{person.status ? <Icon type='check' /> : <Icon type='close' />}</dd>
        <dt>
          <Icon type='coffee' />
        </dt>
        <dd>
          <PersonRoles roles={person.role} />
        </dd>
      </DL>
      <h3>About</h3>
      <Markdown children={person.about || ''} />
    </Col>
  </Row>
)

PersonDetail.propTypes = {
  person: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    about: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    gender: PropTypes.string,
    avatar: PropTypes.any,
    role: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'opportunityProvider', 'volunteer', 'activityProvider', 'tester'])),
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }).isRequired
}

export default PersonDetail

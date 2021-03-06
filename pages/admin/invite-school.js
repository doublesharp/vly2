import React, { Component } from 'react'
import { FullPage } from '../../components/VTheme/VTheme'
import adminPage from '../../hocs/adminPage'
import SchoolInviteForm from '../../components/Org/SchoolInviteForm'
import fetch from 'isomorphic-fetch'
import callApi from '../../lib/callApi'

class InviteSchool extends Component {
  static async getInitialProps ({ req }) {
    let cookies = {}

    if (req) {
      cookies = req.cookies
    }

    let schools = []

    try {
      schools = await callApi('schools?p=schoolId%20name', 'GET', null, cookies)
    } catch (error) {
      console.log(error)
    }

    return {
      schools: schools
    }
  }

  render () {
    return (
      <FullPage>
        <SchoolInviteForm onSubmit={this.handleSubmit} schoolOptions={this.props.schools} />
      </FullPage>
    )
  }

  async handleSubmit (invite) {
    const response = await fetch('/api/notify/school-invite', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(invite),
      headers: { 'Content-Type': 'application/json' }
    })

    return response.ok
  }
}

export default adminPage(InviteSchool)

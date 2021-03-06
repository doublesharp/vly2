import { Button, message } from 'antd'
import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import reduxApi from '../../lib/redux/reduxApi.js'
import { useDispatch, useSelector } from 'react-redux'

export const EditablePersonPanel = ({ person }) => {
  const [editing, setEditing] = useState(false)
  const dispatch = useDispatch()
  const [tags, locations] = useSelector(
    state => [state.tags, state.locations]
  )
  useEffect(() => {
    const getEditorOptions = async () => {
      await Promise.all([
        dispatch(reduxApi.actions.tags.get()),
        dispatch(reduxApi.actions.locations.get({ withRelationships: true }))
      ])
    }
    getEditorOptions()
  }, [])

  const doneEditing = () => {
    window.scrollTo(0, 0)
    setEditing(false)
  }
  const handleUpdate = async (person) => {
    // Only a subset of fields can be updated on the server
    const personData = {
      name: person.name,
      nickname: person.nickname,
      phone: person.phone,
      sendEmailNotifications: person.sendEmailNotifications,
      pronoun: person.pronoun,
      about: person.about,
      location: person.location,
      tags: person.tags,
      website: person.website,
      twitter: person.twitter,
      facebook: person.facebook,
      imgUrl: person.imgUrl,
      imgUrlSm: person.imgUrlSm,
      role: person.role,
      status: person.status,
      education: person.education,
      placeOfWork: person.placeOfWork,
      job: person.job
    }

    await dispatch(
      reduxApi.actions.people.put(
        { id: person._id },
        { body: JSON.stringify(personData) }
      )
    )
    message.success('Saved.')
    doneEditing()
  }

  if (editing) {
    return (
      <PersonDetailForm
        person={person}
        existingTags={tags.data}
        locations={locations.data[0].locations}
        onSubmit={handleUpdate}
        onCancel={doneEditing}
      />)
  }

  return (
    <>
      <Button
        style={{ float: 'right' }}
        type='secondary'
        shape='round'
        onClick={() => setEditing(true)}
      >
        <FormattedMessage
          id='editPerson'
          defaultMessage='Edit'
          description='Button to edit an person on PersonDetails page'
        />
      </Button>
      <PersonDetail person={person} />
    </>
  )
}

export default EditablePersonPanel

import { Avatar, Tooltip } from 'antd'
import React from 'react'
import { UserData } from '../interfaces/interfaces'

type Props = {
  userdata: UserData
}

export const UserProfileBlock: React.FC<Props> = ({ userdata }) => {
  return (
    <div>
      <Tooltip title="Jump to users page" color={userdata.color.hex}>
        <a
          href={userdata.profile ? userdata.profile.url : '#'}
          target={userdata.profile ? '_blank' : ''}
          rel="noreferrer"
        >
          <Avatar
            alt="avatar"
            className="avatar"
            size={100}
            style={{
              border: `solid ${userdata.color.hex}`,
            }}
            src={
              userdata.profile
                ? userdata.profile.avatar.thumb_url
                : process.env.REACT_APP_NOUSER_PNG_URL
            }
          />
        </a>
      </Tooltip>
      <p>{userdata.profile ? userdata.profile.name : ''}</p>
      <p>{userdata.profile ? userdata.profile.wca_id : ''}</p>
    </div>
  )
}

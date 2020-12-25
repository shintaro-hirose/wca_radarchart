import React from 'react'
import { Modal } from 'antd'

export const InfoModal = (): void => {
  Modal.info({
    title: 'Title',
    content: (
      <div>
        <p>some messages...some messages...</p>
        <p>some messages...some messages...</p>
      </div>
    ),
    width: 800,
    maskClosable: true,
  })
}

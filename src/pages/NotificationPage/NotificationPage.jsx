import React from 'react'
import { Notifications } from '../../components/components'
import { CardLayoutBody, CardLayoutContainer, CardLayoutHeader } from '../../components/CardLayout/CardLayout'

export default function NotificationPage() {
    return (
        <CardLayoutContainer>
            <CardLayoutHeader heading={"Notifications"} />
            <CardLayoutBody removeBorder={true}>
                <Notifications />

            </CardLayoutBody>
        </CardLayoutContainer>
    )
}

import React, { useEffect } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { useSelector } from 'react-redux'
import alertType from '../redux/alert/alertType';
import 'react-notifications/lib/notifications.css';

export default function Notification(props) {
    const alert = useSelector(state => state.alert.alert)
  
    useEffect(() => {
      if (Object.keys(alert).length === 0) {
          return
      }
      switch (alert.type) {
          case alertType.ERROR:
            NotificationManager.error(alert.message, 'Error: ', 3000)
            break;
      }
    }, [alert])

    return (
        <NotificationContainer/>
    );
}
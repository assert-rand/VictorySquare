import { AppContext } from '../../Context/AppContext';
import { useContext } from 'react';

const Notifications = ()=>{
    const {notifications} = useContext(AppContext);

    return <div className="notifications d-flex flex-column">
        {
            notifications.map((e, i)=>{
                return <div className="notification">
                    This is a notification.
                </div>
            })
        }
    </div>
}

export default Notifications;
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

class FCMService{
    register=(onRegister, onNotification, onOpenNotification)=> {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification,onOpenNotification)
    }
    buildChannel = (obj) => {
        console.log("build channel called")
        return new firebase.notifications.Android.Channel(
            obj.channelID,obj.channelName,
            firebase.notifications.Android.Importance.High)
        .setDescription(obj.channelDes)
    }
    buildNotification = (obj) => {
        //For Android
        console.log("build notification called")
        console.log(obj.channel._channelId);
        firebase.notifications().android.createChannel(obj.channel)

        //For Android and IOS
        return new firebase.notifications.Notification()
        .setSound(obj.sound)
        .setNotificationId(obj.dataId)
        .setTitle(obj.title)
        .setBody(obj.content)
        .setData(obj.data)

        //For Android
        .android.setChannelId(obj.channel._channelId)
        .android.setColor(obj.colorBgIcon)
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setVibrate(obj.vibrate)
        
    }
    displayNotification = (notification) =>{
        console.log("display notification called")
        firebase.notifications().displayNotification(notification)
        .catch(error => console.log("Display Notification error: ",error))
    }

    removeDeliveredNotification =(notify) => {
        console.log("remove "+notify.notification._notificationId)
        firebase.notifications().removeDeliveredNotification(notify.notification._notificationId)
    }

    checkPermission=(onRegister)=>{
        firebase.messaging().hasPermission()
        .then(enabled=>{
            if(enabled){
                //user has permisison
                this.getToken(onRegister)
            }else{
                //user don't have permission
                this.requestPermission(onRegister)
            }
        }).catch(error=>{
            console.log("Permission Rejected ",error);
        })
    }

    getToken=(onRegister)=>{
        firebase.messaging().getToken()
        .then(fcmToken =>{
            if(fcmToken){
                onRegister(fcmToken)
            }else{
                console.log("User don't have device token")
            }
        }).catch(error=>{
            console.log("getToken Rejected ",error)
        })
    }

    requestPermission=(onRegister)=>{
        firebase.messaging().requestPermission()
        .then(()=>{
            this.getToken(onRegister)
        }).catch(error =>{
            console.log("Request permission rejected ",error)
        })
    }

    createNotificationListeners=(onRegister, onNotification,onOpenNotification)=>{
        //triggered when particular notification received in foreground
        this.notificationListener =firebase.notifications()
        .onNotification( (notification: Notification) => {
            console.log("foreground notification clicked")
            onNotification(notification)
        })

        //If app is in background, you can recieve notification
        this.notificationOpenedListener= firebase.notifications()
        .onNotificationOpened((notificationOpen:NotificationOpen)=>{
            console.log("background notification clicked")
            onOpenNotification(notificationOpen)
        })

       

        //if app is closed
        firebase.notifications().getInitialNotification()
        .then(notificationOpen => {
            if(notificationOpen){
                console.log("killed notification clicked")
                
                const notification: Notification=notificationOpen.notification
                onOpenNotification(notification)
            }
        })

        //triggered for data only payload in foreground
        this.messageListener = firebase.messaging().onMessage((message) => {
            console.log("triggered for payload clicked")
             //onNotification(message)
            onOpenNotification(message)
        })

        //Triggered when have new token
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            console.log("new token refreshed: ",fcmToken)
             onRegister(fcmToken)


             
        })

        

     


        
    }
}

export const fcmService = new FCMService()
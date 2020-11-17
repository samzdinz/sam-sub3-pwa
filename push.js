var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BEICN5ocUQoybF59LJb1Tax0YEjgQril281rON3iHDQ8mcamZ3QGe7C5xQRz_6lTO6lii0HDs55iWgB0lh55hKQ",
    "privateKey": "qcDmpyYXm9WCgqzrAMUa2hbkbSFUlLxnFPILnMkUF4g"
};


webPush.setVapidDetails(
    'mailto:samzdinz@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/dPeV7bxAhVg:APA91bHOqyamKwx7x1zovDyjU_9jOok2vl5TUj1xll9_BiafqXqH0zq1XZ0VtmQfELjaLec0sxpLG_HeCDsxcE3wvdQqThSb6RlOY5Esyv9HeTM7vAdWEHqul9hlxMMKhHE2JR7oEVLq",
    "keys": {
        "p256dh": "BAIkcaV6sb3YneGUhzwLlWs5+YDonhchGq3Bq4RVp0dJv6Rw6qyna20ejrNEGkUAp0H2oF7+lygAtKN04VgKuWY=",
        "auth": "rluf2p9SdY45ZVs5rmak7Q=="
    }
};
var payload = 'Selamat! Aplikasi Liga Premier Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: "378087532318",
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
).catch(function(err) {
    console.log(err);
});

console.log(pushSubscription);
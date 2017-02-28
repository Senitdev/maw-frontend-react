import { notification } from 'antd';

export class NotificationGenerator {

  static pastNotifications = {}

  static getDurationByType(type) {
    switch (type) {
      case 'success':
        return 3.5;

      case 'error':
        return 0;

      default:
        return 3.5;
    }
  }

  static raise(message, description, type) {

    const newNotification = {
      key: Date.now(),
      message: message,
      description: description,
      type: type,
      duration: this.getDurationByType(type),
      isClean: false,
    };

    notification[type] ({
      key: newNotification.type,
      placement: 'topRight',
      message: newNotification.message,
      description: newNotification.description,
      duration: newNotification.duration,
      onClose: () => (this.pastNotifications[newNotification.key] = newNotification),
    });
  }
}

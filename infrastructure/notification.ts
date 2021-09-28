import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationType } from './enums/notification-types.enum';

export function createNotification(message: string, notificationType?: NotificationType): void {
	toast.configure();
	const closeIn = 5000;
	switch (notificationType) {
		case NotificationType.Info:
			toast.info(message, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: closeIn });
			break;
		case NotificationType.Warning:
			toast.warn(message, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: closeIn });
			break;
		case NotificationType.Error:
			toast.error(message, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: closeIn });
			break;
		default:
			toast.success(message, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: closeIn });
	}
}
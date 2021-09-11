export type SnackbarVariationType = 'success' | 'warning' | 'info' | 'error';

export interface Notification {
    id?: number;
    variant: SnackbarVariationType;
    message: string;
    duration?: number;
}

export type ShowSnackbarMsgType = (variant: SnackbarVariationType, message: string) => void;

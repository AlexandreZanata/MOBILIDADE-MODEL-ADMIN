/**
 * ConfirmDialog - Wrapper para Modal.confirm do Ant Design
 * Facilita confirmações de ações perigosas
 */

import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmDialogOptions {
  title: string;
  content: string;
  onOk: () => void | Promise<void>;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'danger';
}

export const showConfirmDialog = (options: ConfirmDialogOptions) => {
  const {
    title,
    content,
    onOk,
    onCancel,
    okText = 'Confirmar',
    cancelText = 'Cancelar',
    okType = 'danger',
  } = options;

  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText,
    cancelText,
    okType,
    onOk,
    onCancel,
    centered: true,
  });
};


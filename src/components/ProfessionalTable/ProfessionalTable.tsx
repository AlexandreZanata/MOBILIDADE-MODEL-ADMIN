/**
 * ProfessionalTable - Componente de tabela profissional
 * CORRIGIDO: Ícones melhorados, paginação à esquerda
 */

import React from 'react';
import { Table, ConfigProvider } from 'antd';
import type { TableProps } from 'antd';
import { useTheme } from '@/themes/ThemeProvider';
import './ProfessionalTable.css';

interface ProfessionalTableProps<T> extends Omit<TableProps<T>, 'style'> {
    columns: TableProps<T>['columns'];
    dataSource: T[];
    [key: string]: any;
}

export const ProfessionalTable: React.FC<ProfessionalTableProps<any>> = ({
                                                                             columns,
                                                                             dataSource,
                                                                             ...props
                                                                         }) => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const customColumns = (columns || []).map((col: any) => ({
        ...col,
        ellipsis: col.ellipsis !== false,
    }));

    return (
        <div
            style={{
                borderRadius: 12,
                overflow: 'hidden',
                background: isDark ? '#1F2937' : '#FFFFFF',
                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
            }}
            className="professional-table-wrapper"
        >
            <style>{`
        .professional-table-wrapper .ant-pagination {
          justify-content: flex-start !important;
          padding-left: 16px !important;
        }

        .professional-table-wrapper .ant-pagination-item-active {
          border-color: #0374C8 !important;
          background-color: #0374C8 !important;
        }

        .professional-table-wrapper .ant-pagination-item-active a {
          color: #FFFFFF !important;
        }

        .professional-table-wrapper .ant-pagination-item:hover {
          border-color: #0374C8 !important;
        }

        .professional-table-wrapper .ant-pagination-item:hover a {
          color: #0374C8 !important;
        }
      `}</style>

            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: isDark ? '#1F2937' : '#FFFFFF',
                        colorBorder: isDark ? '#374151' : '#E5E7EB',
                        colorText: isDark ? '#F9FAFB' : '#111827',
                        colorTextSecondary: isDark ? '#D1D5DB' : '#6B7280',
                        borderRadius: 12,
                    },
                    components: {
                        Table: {
                            headerBg: isDark ? '#111827' : '#F9FAFB',
                            headerColor: isDark ? '#F9FAFB' : '#111827',
                            headerBorderRadius: 12,
                            rowHoverBg: isDark ? '#374151' : '#F0F7FF',
                            borderColor: isDark ? '#374151' : '#E5E7EB',
                        },
                    },
                }}
            >
                <Table
                    columns={customColumns}
                    dataSource={dataSource}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total: ${total} registros`,
                        locale: {
                            items_per_page: 'por página',
                            jump_to: 'Ir para',
                            jump_to_confirm: 'confirmar',
                            page: 'página',
                        },
                    }}
                    locale={{
                        emptyText: 'Nenhum dado disponível',
                    }}
                    scroll={{ x: 'max-content' }}
                    {...props}
                />
            </ConfigProvider>
        </div>
    );
};
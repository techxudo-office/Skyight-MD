import React from 'react';
import { utils, writeFile } from 'xlsx';
import { SecondaryButton } from '../components'; // Adjust import path as needed
import { SiGooglesheets } from 'react-icons/si';

const ExcelExportButton = ({
    data,
    fileName = 'export',
    buttonText = 'Export',
    buttonProps = {},
    excludeKeys = [],
    className = ''
}) => {
    const handleExport = () => {
        if (!data || data.length === 0) {
            console.warn('No data to export');
            return;
        }

        // Process data for export
        const exportData = data.map(item => {
            const row = {};

            Object.keys(item).forEach(key => {
                if (!excludeKeys.includes(key)) {
                    const value = item[key];
                    row[key] = typeof value === 'object' ? JSON.stringify(value) : value;
                }
            });

            return row;
        });

        // Create worksheet and workbook
        const ws = utils.json_to_sheet(exportData);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Sheet1");

        // Generate filename with current date
        const formattedFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Export the file
        writeFile(wb, formattedFileName);
    };

    return (
        <SecondaryButton
            className={className}
            text={buttonText}
            onClick={handleExport}
            {...buttonProps}
            icon={<SiGooglesheets />}
        />
    );
};

export default ExcelExportButton;
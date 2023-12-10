import React from 'react';
import { MdHourglassEmpty, MdHourglassFull, MdCheckCircle, MdClose } from 'react-icons/md';
import { IoMdCheckmark } from 'react-icons/io';
import { StatusType } from '@/types'; // Update with the correct path

interface StatusProps {
    status: StatusType;
}

const Status: React.FC<StatusProps> = ({ status }) => {
    let icon;
    let color;

    switch (status) {
        case StatusType.NOT_STARTED:
            icon = <></>;
            color = ' border-gray-500';
            break;
        case StatusType.PENDING:
            icon = <MdHourglassFull />;
            color = 'bg-gray-500 border-gray-500';
            break;
        case StatusType.PROCESSING:
            icon = <MdHourglassFull />;
            color = 'bg-yellow-500 border-yellow-500';
            break;
        case StatusType.SUCCESS:
            icon = <IoMdCheckmark />;
            color = 'bg-green-500 border-green-500';
            break;
        case StatusType.FAILURE:
            icon = <MdClose />;
            color = 'bg-red-500 border-red-500 ';
            break;
        default:
            break;
    }

    return (
        <div className={`status-icon w-6 h-6 mx-5 flex justify-center items-center rounded-full p-1 border ${color} text-white`}>
            {icon}
        </div>
    );
};

export default Status;
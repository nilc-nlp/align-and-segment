import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { IconType } from 'react-icons';
import ReactMarkdown from 'react-markdown';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

interface InfoCardProps {
    icon: IconType;
    title: string;
    shortDescription: string;
    markdownDescription: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, shortDescription, markdownDescription }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Card sx={{ width: 350, margin: 8 }}>
                <CardContent>
                    <div className='flex items-center justify-start'>
                        <Icon style={{ fontSize: 40, color: 'lightblue', marginRight: 16 }} />
                        <Typography variant="h6" component="div">
                            {title}
                        </Typography>
                    </div>
                    <Typography variant="body2" color="text.secondary">
                        {shortDescription}{' '}
                        <span
                            style={{ textDecoration: 'underline', color: 'gray', cursor: 'pointer' }}
                            onClick={handleOpen}
                        >
                            Know More
                        </span>
                    </Typography>
                </CardContent>
            </Card>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    <div className='flex items-center justify-start'>
                        <Icon style={{ fontSize: 40, color: 'lightblue' }} />
                        <Typography variant="h5" component="div" sx={{ marginLeft: 2 }}>
                            {title}
                        </Typography>
                    </div>
                    <Typography variant="body2" color="text.secondary">
                        {shortDescription}
                    </Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <ReactMarkdown>{markdownDescription}</ReactMarkdown>
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
};
export default InfoCard;

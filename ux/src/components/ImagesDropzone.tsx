import React, {FC, useCallback, useState} from 'react';
import clsx from 'clsx';
import {useDropzone} from 'react-dropzone';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Tooltip,
    Typography
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MoreIcon from '@material-ui/icons/MoreVert';
import {Theme} from 'src/theme';
import api from 'src/utils/api';
import bytesToSize from 'src/utils/bytesToSize';
import {Image} from 'src/types/image';

interface ImagesDropzoneProps {
    dataset_id: string;
    setImages: any;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    dropZone: {
        border: `1px dashed ${theme.palette.divider}`,
        padding: theme.spacing(6),
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignItems: 'center',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            opacity: 0.5,
            cursor: 'pointer'
        }
    },
    dragActive: {
        backgroundColor: theme.palette.action.active,
        opacity: 0.5
    },
    image: {
        width: 130
    },
    info: {
        marginTop: theme.spacing(1)
    },
    list: {
        maxHeight: 320
    },
    actions: {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'flex-end',
        '& > * + *': {
            marginLeft: theme.spacing(2)
        },
        color: theme.palette.background.dark
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

const ImagesDropzone: FC<ImagesDropzoneProps> = ({dataset_id, setImages, className, ...rest}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [files, setFiles] = useState([]);

    const handleDrop = useCallback((acceptedImages) => {
        setFiles((prevImages) => [...prevImages].concat(acceptedImages));
    }, []);

    const handleRemoveAll = () => {
        setFiles([]);
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: 'image/jpeg, image/png',
        onDrop: handleDrop,
        minSize: 0,
        maxSize: 1000 * 1024 * 1024
    });

    const handleUpload = async () => {
        if (!isUploading) {
            setIsUploading(true);
            let formData = new FormData();
            files.map(image => formData.append(image.name, image));
            try {
                const response = await api.post<Image[]>(`/v1/images/upload/${dataset_id}`, formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                setImages((images: Image[]) => [...images, ...response.data]);
                enqueueSnackbar(`${files.length} images uploaded`, {variant: 'info'});
            } catch (error) {
                enqueueSnackbar((error.response && error.response.data) || 'Something went wrong', {variant: 'error'});
            } finally {
                setIsUploading(false);
                setFiles([]);
            }
        }
    };

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <div
                className={clsx({
                    [classes.dropZone]: true,
                    [classes.dragActive]: isDragActive
                })}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <div>
                    <img
                        alt="Select Images"
                        className={classes.image}
                        src="/static/images/undraw_add_file2_gvbb.svg"
                    />
                </div>
                <div>
                    <Typography
                        gutterBottom
                        variant="h3"
                    >
                        Select images
                    </Typography>
                    <Box mt={2}>
                        <Typography
                            color="textPrimary"
                            variant="body1"
                        >
                            Drop images here or click
                            {' '}
                            <Link underline="always">browse</Link>
                            {' '}
                            thorough your machine
                        </Typography>
                    </Box>
                </div>
            </div>
            {files.length > 0 && (
                <>
                    <PerfectScrollbar options={{suppressScrollX: true}}>
                        <List className={classes.list}>
                            {files.map((file, i) => (
                                <ListItem
                                    divider={i < files.length - 1}
                                    key={i}
                                >
                                    <ListItemIcon>
                                        <FileCopyIcon/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={file.name}
                                        primaryTypographyProps={{variant: 'h5'}}
                                        secondary={bytesToSize(file.size)}
                                    />
                                    <Tooltip title="More options">
                                        <IconButton edge="end">
                                            <MoreIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            ))}
                        </List>
                    </PerfectScrollbar>
                    <div className={classes.actions}>
                        <Button
                            onClick={handleRemoveAll}
                            size="small"
                        >
                            Remove all
                        </Button>
                        <Button
                            color="secondary"
                            size="small"
                            variant="contained"
                            onClick={handleUpload}
                            endIcon={isUploading && (
                                <CircularProgress
                                    className={classes.loader}
                                    color="inherit"
                                />
                            )}
                        >
                            Upload images
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};


export default ImagesDropzone;

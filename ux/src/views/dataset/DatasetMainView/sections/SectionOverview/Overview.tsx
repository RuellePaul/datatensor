import React, {FC} from 'react';
import {Box, Divider, Stack, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {
    CategoryOutlined as CategoriesIcon,
    LocalOfferOutlined as LabelsIcon,
    PhotoLibraryOutlined as ImagesIcon
} from '@mui/icons-material';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';
import getDateDiff from 'src/utils/getDateDiff';


const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    icon: {
        color: theme.palette.text.primary,
        marginRight: 10,
        verticalAlign: 'middle'
    },
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(2)
    },
    stack: {
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            '& > div': {
                margin: `${theme.spacing(0, 0, 1, 0)} !important`
            }
        }
    }
}));

interface OverviewProps {
    className?: string;
}

const Overview: FC<OverviewProps> = ({ className }) => {
    const classes = useStyles();

    const { dataset, categories } = useDataset();
    const { images } = useImages();

    const totalLabelsCount = categories.map(category => category.labels_count || 0).reduce((acc, val) => acc + val, 0);

    if (images.length === 0) return null;

    return (
        <Box className={classes.root} display="flex" alignItems="center" justifyContent="space-between">
            <Stack
                className={classes.stack}
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                <Box className={classes.wrapper}>
                    <ImagesIcon className={classes.icon} />

                    <Typography fontWeight={600} color="textPrimary">
                        {dataset.image_count + dataset.augmented_count}{' '}
                        <Typography variant="subtitle1" component="span" color="textSecondary" fontWeight={400}>
                            images
                        </Typography>
                    </Typography>
                </Box>
                <Box className={classes.wrapper}>
                    <CategoriesIcon className={classes.icon} />

                    <Typography fontWeight={600} color="textPrimary">
                        {categories.length}{' '}
                        <Typography variant="subtitle1" component="span" color="textSecondary" fontWeight={400}>
                            categories
                        </Typography>
                    </Typography>
                </Box>
                <Box className={classes.wrapper}>
                    <LabelsIcon className={classes.icon} />

                    <Typography fontWeight={600} color="textPrimary">
                        {totalLabelsCount}{' '}
                        <Typography variant="subtitle1" component="span" color="textSecondary" fontWeight={400}>
                            labels
                        </Typography>
                    </Typography>
                </Box>
            </Stack>

            <Typography variant="caption" color="textSecondary">
                Created {getDateDiff(new Date(), dataset.created_at, 'passed_event')}
            </Typography>
        </Box>
    );
};

export default Overview;

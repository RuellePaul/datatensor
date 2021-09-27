import React, {FC} from 'react';
import Chart from 'react-apexcharts';
import {capitalize, makeStyles, useTheme} from '@material-ui/core';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {COLORS} from 'src/utils/colors';

interface CategoriesDistributionProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        marginTop: -10
    },
}));


const CategoriesDistribution: FC<CategoriesDistributionProps> = ({className, ...rest}) => {

    const classes = useStyles();
    const theme = useTheme();

    const {categories} = useDataset();

    if (categories === null || categories.length === 0)
        return null;

    const top10categories = categories.sort((a, b) => a.labels_count > b.labels_count ? -1 : 1).slice(0, 9)

    return (
        <Chart
            className={classes.root}
            options={{
                colors: COLORS,
                chart: {
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: {
                            enabled: true,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 350
                        }
                    },
                    width: '100%',
                    toolbar: {
                        show: false
                    }
                },
                dataLabels: {
                    enabled: true,
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: [theme.palette.text.secondary]
                    }
                },
                grid: {
                    show: false
                },
                legend: {
                    show: false
                },
                plotOptions: {
                    bar: {
                        borderRadius: 10,
                        dataLabels: {
                            position: 'top',
                        },
                        distributed: true
                    }
                },
                tooltip: {
                    enabled: false
                },
                xaxis: {
                    categories: top10categories.map(category => capitalize(category.name)),
                    labels: {
                        style: {
                            colors: COLORS,
                            fontSize: '12px'
                        }
                    }
                },
                yaxis: {
                    show: false
                }
            }}
            series={[
                {
                    name: 'Categories',
                    data: top10categories.map(category => category.labels_count)
                }
            ]}
            type='bar'
            height={350}
        />
    );
};

export default CategoriesDistribution;

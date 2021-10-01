import React, { FC } from "react";
import Chart from "react-apexcharts";
import { capitalize, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "src/theme";
import useDataset from "src/hooks/useDataset";
import { COLORS } from "src/utils/colors";

interface CategoriesDistributionProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        marginTop: -10
    }
}));

const CategoriesDistribution: FC<CategoriesDistributionProps> = ({
    className,
    ...rest
}) => {
    const classes = useStyles();
    const theme = useTheme();

    const {categories} = useDataset();

    if (categories === null || categories.length === 0) return null;

    const top10categories = categories
        .sort((a, b) => (a.labels_count > b.labels_count ? -1 : 1))
        .slice(0, 9);

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
                    offsetY: -25,
                    style: {
                        fontSize: '13px',
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
                        dataLabels: {
                            position: 'top'
                        },
                        distributed: true,
                        borderRadius: 0,
                        columnWidth: '13px'
                    }
                },
                tooltip: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    theme: theme.palette.mode,
                    shared: true,
                    intersect: false,
                    onDatasetHover: {
                        highlightDataSeries: true
                    },
                    marker: {
                        show: false
                    },
                    custom: function({series, seriesIndex, dataPointIndex, w}) {
                        return `<div class="apex-tooltip" style="background: ${
                            theme.palette.background.default
                        }">
                                ${capitalize(
                                    top10categories[dataPointIndex].name
                                )}
                                <br/>
                                ${series[seriesIndex][dataPointIndex]}
                            </div>`;
                    }
                },
                xaxis: {
                    categories: top10categories.map(category =>
                        capitalize(category.name)
                    ),
                    labels: {
                        style: {
                            colors: COLORS,
                            fontWeight: 'bold',
                            fontSize: '13px'
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
            type="bar"
            height={350}
        />
    );
};

export default CategoriesDistribution;

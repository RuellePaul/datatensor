import React, {FC} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {Bar} from 'react-chartjs-2';
import {fade, makeStyles, useTheme} from '@material-ui/core';
import {Theme} from 'src/theme';

interface ChartProps {
    className?: string;
    data: any[];
    labels: string[];
}

const useStyles = makeStyles(() => ({
    root: {
        position: 'relative'
    }
}));

const ComposedChart: FC<ChartProps> = ({
                                           className,
                                           data: dataProp,
                                           labels,
                                           ...rest
                                       }) => {
    const classes = useStyles();
    const theme: Theme = useTheme();

    const data = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');

        const gradientBar = ctx.createLinearGradient(0, 0, 0, 600);
        gradientBar.addColorStop(0, fade(theme.palette.primary.main, 0.4));
        gradientBar.addColorStop(0.75, fade(theme.palette.primary.main, 0.1));
        gradientBar.addColorStop(1, 'rgba(255,255,255,0)');

        const gradientLine = ctx.createLinearGradient(0, 0, 0, 300);
        gradientLine.addColorStop(0, fade(theme.palette.secondary.main, 0.2));
        gradientLine.addColorStop(0.6, fade(theme.palette.secondary.main, 0.1));
        gradientLine.addColorStop(1, fade(theme.palette.secondary.main, 0.05));
        return {
            datasets: [
                {
                    data: dataProp,
                    backgroundColor: gradientBar,
                    borderColor: theme.palette.secondary.main,
                    pointBorderColor: theme.palette.background.default,
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: theme.palette.secondary.main,
                    yAxisID: 'y-axis-count'
                },
                {
                    type: 'line',
                    data: dataProp.map((elem, index) => dataProp.slice(0, index + 1).reduce((a, b) => a + b)),
                    backgroundColor: gradientLine,
                    borderColor: theme.palette.secondary.main,
                    pointBorderColor: theme.palette.background.default,
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: theme.palette.secondary.main,
                    yAxisID: 'y-axis-total'
                },
            ],
            labels
        };
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 500,
            easing: 'easeOutQuint'
        },
        legend: {
            display: false
        },
        layout: {
            padding: 0
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10,
                        fontColor: theme.palette.text.secondary,
                        fontSize: 14,
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }
            ],
            yAxes: [
                {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-count',
                    gridLines: {
                        borderDash: [3],
                        borderDashOffset: [3],
                        color: theme.palette.divider,
                        drawBorder: false,
                        zeroLineBorderDash: [3],
                        zeroLineBorderDashOffset: [3],
                        zeroLineColor: theme.palette.divider
                    },
                    ticks: {
                        padding: 20,
                        fontColor: theme.palette.text.secondary,
                        beginAtZero: true,
                        fontSize: 14,
                        min: 0,
                        maxTicksLimit: 7,
                        callback: (value: number) => (value % 1 === 0 ? value : '')
                    }
                },
                {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-axis-total',
                    ticks: {
                        padding: 20,
                        fontColor: theme.palette.text.secondary,
                        beginAtZero: true,
                        fontSize: 14,
                        min: 0,
                        maxTicksLimit: 7,
                        callback: (value: number) => (value % 1 === 0 ? value : '')
                    }
                }
            ]
        },
        tooltips: {
            enabled: true,
            mode: 'index',
            intersect: false,
            caretSize: 0,
            yPadding: 20,
            xPadding: 20,
            borderWidth: 1,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.default,
            titleFontColor: theme.palette.text.primary,
            bodyFontColor: theme.palette.text.secondary,
            footerFontColor: theme.palette.text.secondary,
            callbacks: {
                title: () => {
                },
                label: (tooltipItem: any) => {
                    if (tooltipItem.datasetIndex === 0) {
                        return tooltipItem.yLabel > 0
                            ? ` ${tooltipItem.yLabel} (registered)`
                            : ` No users`
                    } else if (tooltipItem.datasetIndex === 1) {
                        return ` ${tooltipItem.yLabel} (total)`
                    }
                }
            }
        }
    };

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Bar
                data={data}
                options={options}
            />
        </div>
    );
};

ComposedChart.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired
};

export default ComposedChart;

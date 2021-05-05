import React, {FC} from 'react';
import {Box, Divider, ListItemIcon, makeStyles, Menu, MenuItem, Typography} from '@material-ui/core';
import Nesteditem from 'material-ui-nested-menu-item';
import {Tag as CategoryIcon, Trash as DeleteIcon} from 'react-feather';
import {Label} from 'src/types/label';
import {Point} from 'src/types/point';
import {Theme} from 'src/theme';
import {reset} from 'src/utils/labeling';
import useDataset from 'src/hooks/useDataset';

interface ContextMenuProps {
    canvas: HTMLCanvasElement;  // ToolMove's canvas
    labels: Label[];
    selectedLabels: Label[];
    setLabels: (labels: Label[]) => void;
    point: Point;
    handleClose: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    item: {
        minWidth: 150
    }
}));

const ContextMenu: FC<ContextMenuProps> = ({canvas, labels, setLabels, selectedLabels, point, handleClose}) => {

    const classes = useStyles();

    const {dataset} = useDataset();

    const handleUpdateLabelCategory = (category) => {
        handleClose();
        reset(canvas);
        setLabels(
            labels.map(label => selectedLabels.map(selectedLabel => selectedLabel.id).includes(label.id)
                ? {...label, category_id: category.id}
                : label)
        )
    };

    const handleDeleteLabel = () => {
        handleClose();
        reset(canvas);
        const newLabels = labels.filter(label => !selectedLabels.map(label => label.id).includes(label.id));
        setLabels(newLabels);
    };

    return (
        <Menu
            keepMounted
            open={point[0] !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                point[0] !== null
                    ? {top: point[1], left: point[0]}
                    : undefined
            }
        >
            <Nesteditem
                parentMenuOpen={point[0] !== null}
                label={(
                    <>
                        <ListItemIcon>
                            <CategoryIcon/>
                        </ListItemIcon>
                        <Typography variant="inherit" noWrap>
                            Category
                        </Typography>
                    </>
                )}
            >
                {dataset.categories.map(category => (
                    <MenuItem
                        className={classes.item}
                        key={category.id}
                        onClick={() => handleUpdateLabelCategory(category)}
                    >
                        <Typography variant="inherit" noWrap>
                            {category.name.toUpperCase()}
                        </Typography>
                    </MenuItem>
                ))}
            </Nesteditem>
            <Box my={0.5}>
                <Divider/>
            </Box>
            <MenuItem
                className={classes.item}
                onClick={handleDeleteLabel}
            >
                <ListItemIcon>
                    <DeleteIcon/>
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Delete
                </Typography>
            </MenuItem>
        </Menu>
    )
};

export default ContextMenu;
import React, {FC} from 'react';
import {Box, capitalize, Divider, ListItemIcon, Menu, MenuItem, Typography} from '@mui/material';
import NestedMenuItem from 'src/components/utils/NestedMenuItem';
import makeStyles from '@mui/styles/makeStyles';
import {Tag as CategoryIcon, Trash as DeleteIcon} from 'react-feather';
import {Label} from 'src/types/label';
import {Point} from 'src/types/point';
import {Theme} from 'src/theme';
import {reset} from 'src/utils/labeling';
import useDataset from 'src/hooks/useDataset';
import useImage from 'src/hooks/useImage';

interface ContextMenuProps {
    canvas: HTMLCanvasElement; // ToolMove's canvas
    selectedLabels: Label[];
    point: Point;
    handleClose: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    item: {
        minWidth: 150
    }
}));

const ContextMenu: FC<ContextMenuProps> = ({
    canvas,
    selectedLabels,
    point,
    handleClose
}) => {
    const classes = useStyles();

    const {categories} = useDataset();
    const {labels, saveLabels, storePosition} = useImage();

    const handleUpdateLabelCategory = category => {
        handleClose();
        reset(canvas);
        let newLabels = labels.map(label =>
            selectedLabels
                .map(selectedLabel => selectedLabel.id)
                .includes(label.id)
                ? {...label, category_id: category.id}
                : label
        );
        saveLabels(newLabels);
        storePosition(newLabels);
    };

    const handleDeleteLabel = () => {
        handleClose();
        reset(canvas);
        const newLabels = labels.filter(
            label => !selectedLabels.map(label => label.id).includes(label.id)
        );
        saveLabels(newLabels);
        storePosition(newLabels);
    };

    return (
        <Menu
            keepMounted
            open={point[0] !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                point[0] !== null ? {top: point[1], left: point[0]} : undefined
            }
        >
            <NestedMenuItem
                parentMenuOpen={point[0] !== null}
                label={
                    <>
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <Typography variant="inherit" noWrap>
                            Category
                        </Typography>
                    </>
                }
            >
                {categories.map(category => (
                    <MenuItem
                        className={classes.item}
                        key={category.name}
                        onClick={() => handleUpdateLabelCategory(category)}
                    >
                        <Typography variant="inherit" noWrap>
                            {selectedLabels
                                .map(selectedLabel => selectedLabel.category_id)
                                .includes(category.id) ? (
                                <strong>{capitalize(category.name)}</strong>
                            ) : (
                                capitalize(category.name)
                            )}
                        </Typography>
                    </MenuItem>
                ))}
            </NestedMenuItem>
            <Box my={0.5}>
                <Divider />
            </Box>
            <MenuItem className={classes.item} onClick={handleDeleteLabel}>
                <ListItemIcon>
                    <DeleteIcon />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Delete
                </Typography>
            </MenuItem>
        </Menu>
    );
};

export default ContextMenu;

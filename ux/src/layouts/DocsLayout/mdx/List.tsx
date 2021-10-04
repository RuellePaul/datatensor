import type {FC, ReactNode} from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import type {Theme} from 'src/theme';

interface ListProps {
    children?: ReactNode;
    variant: 'ul' | 'ol';
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginLeft: theme.spacing(4),
        marginBottom: theme.spacing(2)
    }
}));

const List: FC<ListProps> = ({
                                 variant: Component,
                                 children,
                                 ...rest
                             }) => {
    const classes = useStyles();

    return (
        <Component
            className={classes.root}
            {...rest}
        >
            {children}
        </Component>
    );
};

List.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['ul', 'ol'])
};

List.defaultProps = {
    variant: 'ul'
};

export default List;

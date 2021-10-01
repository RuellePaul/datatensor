import React, { FC } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "src/theme";
import { API_HOSTNAME } from "src/utils/api";

interface SwaggerAPIlProps {}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        minHeight: 'calc(100vh - 340px)',
        background: 'white'
    }
}));

const SwaggerAPI: FC<SwaggerAPIlProps> = () => {
    const classes = useStyles();

    return (
        <iframe
            className={classes.root}
            src={`http://${API_HOSTNAME}/docs`}
            title="Datatensor API"
        />
    );
};

export default SwaggerAPI;

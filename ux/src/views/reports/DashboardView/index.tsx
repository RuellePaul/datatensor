import React, {FC, useEffect, useRef, useState} from 'react';
import {Container, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const DashboardView: FC = () => {

    const classes = useStyles();

    const [isPaused, setPause] = useState(false);
    const ws = useRef(null);

    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        ws.current = new WebSocket(`ws://127.0.0.1:4069/message`);
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        return () => {
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = (event) => {
            if (isPaused) return;
            
            setMessages(messages => [...messages, event.data]);
        };
    }, [isPaused]);

    function sendMessage(event) {
        ws.current.send(':D');
        event.preventDefault();
    }

    return (
        <Page
            className={classes.root}
            title="Dashboard"
        >
            <Container maxWidth="lg">
                <button onClick={() => setPause(!isPaused)}>
                    {isPaused ? "Resume" : "Pause"}
                </button>

                <button onClick={event => sendMessage(event)}>
                    Send message
                </button>

                <pre>
                    {JSON.stringify(messages, null, 4)}
                </pre>
            </Container>
        </Page>
    );
};

export default DashboardView;

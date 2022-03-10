import { usePolling } from "hooks";
import { useEffect } from "react";

export const Poller = ({ url, pollingPeriod, poll, onPoll }) => {
    // TODO This is bound to a pendulum
    const polling = usePolling(url, pollingPeriod, onPoll);

    useEffect(() => {
        if (poll) {
            polling.start();
        } else {
            polling.stop();
        }

        return () => polling.stop();
    }, [poll, polling])

    return null;
};

import { usePolling } from "hooks";
import { useEffect } from "react";

export const Poller = ({ shape, url, pollingPeriod, poll }) => {
    // TODO This is bound to a pendulum
    const polling = usePolling(url, pollingPeriod, json => {
        shape.bob.x = json.bobPosition.x;
        shape.bob.y = json.bobPosition.y;
    });

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

import { useEffect, useState } from "react";
import { HttpClient } from "utils";

export function usePolling(url, period, callback) {
    const [poll, setPoll] = useState(false);

    useEffect(() => {
        const polling = setInterval(() => {
            if (poll) {
                HttpClient.get(url, callback);
            }
        }, period);

        return () => {
            clearInterval(polling);
        };
    }, [poll, url, period, callback]);

    return {
        start: () => setPoll(true),
        stop: () => setPoll(false),
    }
}

import { useEffect, useState } from "react";
import { HttpClient } from "utils";

export function usePolling(url, period, callback) {
    const [poll, setPoll] = useState(false);

    useEffect(() => {
        const polling = setInterval(async () => {
            if (poll) {
                const response = await HttpClient.get(url);
                if (response.status === 200) {
                    const json = await response.json();
                    callback(json);
                }
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

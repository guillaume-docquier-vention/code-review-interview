import { useEffect, useState } from "react";
import { HttpClient } from "utils";

export function usePolling(urls, period, callback) {
    const [poll, setPoll] = useState(false);

    useEffect(() => {
        const polling = setInterval(() => {
            if (poll) {
                for (let i = 0; i < urls.length; i++) {
                    HttpClient.get(urls[i], json => callback(json, i));
                }
            }
        }, period);

        return () => {
            clearInterval(polling);
        };
    }, [poll, urls, period, callback]);

    return {
        start: () => setPoll(true),
        stop: () => setPoll(false),
    }
}

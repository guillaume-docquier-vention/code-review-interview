import { useEffect } from "react";
import { HttpClient } from "utils";

export function usePolling(url, period, callback) {
    useEffect(() => {
        const polling = setInterval(() => {
            HttpClient.get(url, callback);
        }, period);

        return () => {
            clearInterval(polling);
        };
    }, [url, period, callback]);
}

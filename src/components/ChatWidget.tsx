import { useEffect } from 'react';

declare global {
    interface Window {
        chatbase: any;
    }
}

export const ChatWidget = () => {
    useEffect(() => {
        (function () {
            if (!window.chatbase || window.chatbase("getState") !== "initialized") {
                window.chatbase = (...args: any[]) => {
                    if (!window.chatbase.q) {
                        window.chatbase.q = [];
                    }
                    window.chatbase.q.push(args);
                };
                window.chatbase = new Proxy(window.chatbase, {
                    get(target: any, prop: any) {
                        if (prop === "q") {
                            return target.q;
                        }
                        return (...args: any[]) => target(prop, ...args);
                    }
                });
            }
            const onLoad = function () {
                const script = document.createElement("script");
                script.src = "https://www.chatbase.co/embed.min.js";
                script.id = "9c-G8YSdRjJfVq7rFKPUL";
                (script as any).domain = "www.chatbase.co";
                document.body.appendChild(script);
            };
            if (document.readyState === "complete") {
                onLoad();
            } else {
                window.addEventListener("load", onLoad);
            }
        })();
    }, []);

    return null;
};

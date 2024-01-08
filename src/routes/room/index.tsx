import type { Component } from "solid-js";
import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { createReconnectingWS } from "@solid-primitives/websocket";
import { IWSData } from "../../utils/types";
import Play from "./play";
import Landing from "./landing";

const Room: Component = () => {
    const navigate = useNavigate();

    const roomID = useLocation().pathname.split("/")[2];
    const [localRoomID, _] = createSignal(
        localStorage.getItem("xynmindRoomID") || ""
    );
    const [isLocalAdmin, __] = createSignal(
        localStorage.getItem("xynmindIsAdmin") || ""
    );
    const isRoomAdmin = () =>
        roomID === localRoomID() && isLocalAdmin() === "true";

    const [isPlaying, setIsPlaying] = createSignal(false);
    const [playerCount, setPlayerCount] = createSignal(1);

    const ws = createReconnectingWS(
        `wss://socketsbay.com/wss/v2/1/${import.meta.env.VITE_WS_API_KEY}/`
    );

    ws.addEventListener("message", (ev) => {
        const data: IWSData = JSON.parse(ev.data);
        switch (data.id) {
            case "joinRoom":
                if (isRoomAdmin()) {
                    setPlayerCount(playerCount() + 1);
                }
                break;
            case "leaveRoom":
                if (isRoomAdmin()) {
                    setPlayerCount(playerCount() - 1);
                } else {
                    navigate("/");
                }
                break;
        }
    });

    onMount(() => {
        const data: IWSData = {
            id: "joinRoom",
            message: "",
        };

        ws.send(JSON.stringify(data));
    });

    onCleanup(() => {
        const data: IWSData = {
            id: "leaveRoom",
            message: "",
        };

        ws.send(JSON.stringify(data));
    });

    return (
        <Show
            when={isPlaying()}
            fallback={
                <Landing
                    roomID={roomID}
                    isAdmin={isRoomAdmin()}
                    setIsPlaying={setIsPlaying}
                />
            }
        >
            <Play
                ws={ws}
                playerCount={playerCount()}
                isAdmin={isRoomAdmin()}
                setIsPlaying={setIsPlaying}
            />
        </Show>
    );
};

export default Room;

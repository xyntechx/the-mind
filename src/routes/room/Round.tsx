import type { Component } from "solid-js";
import { useLocation } from "@solidjs/router";

const Round: Component = () => {
    const roundIndex = useLocation().pathname.split("/")[3];

    return (
        <>
            <h1>Round {roundIndex}</h1>
        </>
    );
};

export default Round;

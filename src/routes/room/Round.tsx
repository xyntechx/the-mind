import type { Component } from "solid-js";
import { useLocation } from "@solidjs/router";

const Round: Component = () => {
    const roundIndex = useLocation().pathname.split("/")[3];

    return (
        <p>{roundIndex}</p>
    )
}

export default Round

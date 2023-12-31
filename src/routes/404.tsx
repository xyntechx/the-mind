import { Component } from "solid-js";
import { A } from "@solidjs/router";

const NotFound: Component = () => {
    return (
        <>
            <p>
                Oops! This page doesn't exist.{" "}
                <A href="/" class="text-orange-400 transition-colors hover:text-orange-500">
                    Back to home
                </A>
                .
            </p>
        </>
    );
};

export default NotFound;

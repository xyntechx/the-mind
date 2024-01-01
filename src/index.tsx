/* @refresh reload */
import "./index.css";
import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import App from "./App";

const Home = lazy(() => import("./routes/Home"));
const Room = lazy(() => import("./routes/room/Room"));
const Round = lazy(() => import("./routes/room/Round"));
const NotFound = lazy(() => import("./routes/404"));

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
    );
}

render(
    () => (
        <Router root={App}>
            <Route path="/" component={Home} />
            <Route path="/room/:id" component={Room} />
            <Route path="/room/:id/:round" component={Round} />
            <Route path="*404" component={NotFound} />
        </Router>
    ),
    root!
);

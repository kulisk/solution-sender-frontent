import {PROBLEM_ROUTE, HOME_ROUTE} from './const/routes';
import HomePage from "./pages/HomePage";
import ProblemPage from "./pages/ProblemPage";

export const routes = [
    {
        path: HOME_ROUTE,
        Component: HomePage,
    },
    {
        path: `${PROBLEM_ROUTE}/:id`,
        Component: ProblemPage,
    },
];
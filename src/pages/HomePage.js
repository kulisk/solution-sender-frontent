import React, {useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
import {PROBLEM_ROUTE} from "../const/routes";

const HomePage = () => {
    const [problemLinks, setProblemLinks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000').then(async response => {
            let json = await response.json()
            let problems = json.problems.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            })
            setProblemLinks(problems)
        }).catch(error => {
            console.log("Get Problems Error", error)
        })
    }, []);
    return (
        <div className="container mt-5">
            {
                problemLinks.map((link) => <NavLink key={link.id}
                                                    to={`${PROBLEM_ROUTE}/${link.id}`}
                                                    className="problemLink">{link.name}</NavLink>)
            }
        </div>
    );
};

export default HomePage;
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {API_URL} from "../const/url";

const ProblemPage = () => {
    const [languages, setLanguages] = useState([]);
    const [statementUrl, setStatementUrl] = useState('/');
    const [language, setLanguage] = useState(1);
    const [solution, setSolution] = useState('');
    const [submits, setSubmits] = useState([]);
    const [alertShowing, setAlertShowing] = useState(false);
    const [isShareSolution, setIsShareSolution] = useState(false);
    const {id} = useParams();
    const {token} = useParams();

    useEffect(() => {
        fetch(`http://localhost:5000/${id}`, {
            credentials: "include"
        }).then(async response => {
            setStatementUrl(await response.text());
        }).catch(error => {
            console.log("Get statement error", error);
        })

        fetch(`https://checking.sybon.org/api/Compilers`).then(async response => {
            let json = await response.json()
            setLanguages(json.map(language => {
                return {id: language.id, name: language.name}
            }))
        }).catch(error => {
            console.log("Get languages error", error)
        })

        if (token) {
            fetch(`${API_URL}/share/${token}`).then(async res => {
                const json = await res.json();
                setSolution(atob(json.result));
            }).catch(error => {
                console.log("Get shared problem error", error);
            })
        }
        fetch(`${API_URL}/submits/${id}`, {
            credentials: "include",
        }).then(async res => {
            const json = await res.json()
            setSubmits(json.results);
        }).catch(error => {
            console.log("Get submits error", error);
        })
    }, [id, token])

    const onLanguageChange = (event) => {
        setLanguage(event.target.value);
    }

    const onSolutionChange = (event) => {
        setSolution(event.target.value);
    }

    const generateToken = () => {
        return (Date.now() + Math.random() * (1e6 + 4)).toString();
    }

    const sendShareRequest = (shareToken) => {
        const body = {
            solution: solution,
            token: shareToken
        }
        fetch(`${API_URL}/share`, {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(body)
        }).catch(error => {
            console.log("Share solution error", error);
        })
    }

    const onShareClick = async (event) => {
        event.preventDefault();
        if (isShareSolution) {
            const shareToken = generateToken();
            sendShareRequest(shareToken);
            await navigator.clipboard.writeText(window.location.href + '/' + shareToken);
        } else {
            await navigator.clipboard.writeText(window.location.href)
        }
        setAlertShowing(true);
        setTimeout(() => {
            setAlertShowing(false);
        }, 1000)
    }

    const onSubmitClick = (event) => {
        event.preventDefault();
        const body = {
            compilerId: language,
            solution: solution,
            problemId: id
        }
        fetch(API_URL, {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(body)
        }).then(() => {
            fetch(`${API_URL}/submits/${id}`, {
                credentials: "include"
            })
                .then(async res => {
                    const json = await res.json()
                    setSubmits(json.results);
                }).catch(error => {
                console.log("Get submits error", error);
            })
        }).catch(error => {
            console.log("Send solution error", error);
        })
    }

    const getSubmitBg = (submitStatus) => {
        if (submitStatus === 'OK') {
            return "text-success";
        }
        if (submitStatus === 'FAILED') {
            return "text-danger";
        }
        return "text-primary";
    }

    return (
            <div className="container mt-5">
                {alertShowing && <div className="alert alert-success copyAlert">Copied!</div>}
                <a href={statementUrl} target="_blank" rel="noreferrer">Statement</a>
                <form>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <label htmlFor="solutionCode">Solution</label>
                        <div className="selectContainer">
                            <select className="form-select"
                                    aria-label="Default select example"
                                    onChange={(event) => onLanguageChange(event)}
                                    value={language}>
                                {
                                    languages.map(language => <option key={language.id}
                                                                      value={language.id}>{language.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <textarea className="form-control"
                              rows="9"
                              onChange={(event) => onSolutionChange(event)}
                              value={solution}/>
                    <div className="d-flex justify-content-end align-items-center mt-3 mb-3">
                        <input className="form-check-input me-2"
                               onChange={(event) => {
                                   setIsShareSolution(event.target.value);
                               }}
                               type="checkbox"/>
                        <label className="form-check-label me-3" htmlFor="flexCheckDefault">Share with solution</label>
                        <button className="btn btn-primary me-3" onClick={(event) => onShareClick(event)}>Share
                        </button>
                        <button className="btn btn-success" onClick={(event) => onSubmitClick(event)}>Submit
                        </button>
                    </div>
                    {
                        submits.map((submit, index) => <div key={`submit${index}`}
                                                            className={`submitContainer ${getSubmitBg(submit.status)}`}>
                            <div>{submit.status}</div>
                        </div>)
                    }
                </form>
            </div>
    );
};

export default ProblemPage;
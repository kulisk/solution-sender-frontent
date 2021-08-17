import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

const ProblemPage = () => {
    const [languages, setLanguages] = useState([]);
    const [statementUrl, setStatementUrl] = useState('/');

    const {id} = useParams();

    //TODO: maybe you will have to add id in deps
    useEffect(() => {
        fetch(`http://localhost:5000/${id}`).then(async response => {
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
    })

    // const onSubmitClick = () => {
    //
    // }

    return (
        <div className="container mt-5">
            <a href={statementUrl}>Statement</a>
            <form>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <label htmlFor="solutionCode">Solution</label>
                    <div className="selectContainer">
                        <select className="form-select" aria-label="Default select example">
                            {
                                languages.map(language => <option key={language.id}
                                                                  value={language.id}>{language.name}</option>)
                            }
                        </select>
                    </div>
                </div>
                <textarea className="form-control" rows="9"></textarea>
                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary me-3">Share</button>
                    <button className="btn btn-success" type="submit">Submit
                    </button>
                </div>
            </form>
        </div>
    );
};
// onClick={() => onSubmitClick()}
export default ProblemPage;
import React, { Component } from 'react';
import { variables } from './Variables.js';

export class Logger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            moods: [],
            mood_id: 0,
            mood_name: ""
        }
    }

    refreshList() {
        fetch(variables.API_URL + 'mood')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                this.setState({ moods: data });
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    logClick(moodName) {
        fetch(variables.API_URL + 'mood', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // mood_name: this.state.mood_name
                mood_name: moodName
            })
        })
            .then(res => res.json())
            .then((result) => {
                // alert(result);
                this.refreshList()
            })
            .catch((error) => {
                // alert('Failed');
                console.error('Error:', error);
            });

    }
    render() {
        return (
            <div>
                <div>How do you feel today?</div>
                <button type="button" className="btn btn-primary m-2" onClick={() => this.logClick('Happy')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-emoji-smile" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
</svg>
                </button>
                <button type="button" className="btn btn-primary m-2" onClick={() => this.logClick('Okay')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-emoji-neutral" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4 10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m3-4C7 5.672 6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8s1-.672 1-1.5m4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5S9.448 8 10 8s1-.672 1-1.5"/>
</svg>
                </button>
                <button type="button" className="btn btn-primary m-2" onClick={() => this.logClick('Sad')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-emoji-frown" viewBox="0 0 16 16 ">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
</svg>
                </button>
           
                {/* <div>What are your energy levels like?</div>
                <button type="button" className="btn btn-primary m-2" >
                    Low Energy
                </button>
                <button type="button" className="btn btn-primary m-2" >
                    Energised
                </button> */}
            </div>
            
        )
    }
}
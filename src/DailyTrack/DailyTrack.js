import React, { Component } from 'react';
import { variables } from '../Variables.js';

export class DailyTrack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moods: [],
            selectedMood: '',
            // selectedMoodId: null,
            selectedExerciseDuration: 0,
            selectedSleepDuration: 0,
            selectedSocialisation: null
        };
        console.log("Constructor: Component Initialized");
        this.handleMoodSelection = this.handleMoodSelection.bind(this);
        this.handleExerciseDurationChange = this.handleExerciseDurationChange.bind(this);
        this.handleSleepDurationChange = this.handleSleepDurationChange.bind(this);
        this.handleSocialisationChange = this.handleSocialisationChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.refreshList();
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

    handleMoodSelection(mood) {
        this.setState({ selectedMood: mood.mood_name });
    }


    handleExerciseDurationChange(event) {
        this.setState({ selectedExerciseDuration: event.target.value });
    }

    handleSleepDurationChange(event) {
        this.setState({ selectedSleepDuration: event.target.value });
    }

    handleSocialisationChange(value) {
        this.setState({ selectedSocialisation: value });
    }

    handleSubmit() {
        console.log("HandleSubmit: Submitting data...");
        fetch(variables.API_URL + 'mood', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: 1,
                mood_name: this.state.selectedMood,
                exercise_duration: this.state.selectedExerciseDuration,
                sleep_duration: this.state.selectedSleepDuration,
                socialisation: this.state.selectedSocialisation
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result.message);
                this.refreshList();
            })
            .catch((error) => {
                alert('Failed');
                console.error('Error:', error);
            });
    }

    render() {
        console.log('Render: component is rendering');
        console.log("Current state: ", this.state);
        return (
            <div>
                <h3>This is the Daily Tracker page</h3>
                <form>
                    {/* <div>How did you feel overall today?</div>
                    <button type="button"
                        className={`btn btn-primary m-2 ${this.state.selectedMood === 'Sad' ? 'btn-secondary' : ''}`}
                        onClick={() => this.handleMoodSelection('Sad')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-emoji-frown" viewBox="0 0 16 16 ">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                        </svg>
                    </button>
                    <button type="button"
                        className={`btn btn-primary m-2 ${this.state.selectedMood === 'Okay' ? 'btn-secondary' : ''}`}
                        onClick={() => this.handleMoodSelection('Okay')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-emoji-neutral" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4 10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m3-4C7 5.672 6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8s1-.672 1-1.5m4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5S9.448 8 10 8s1-.672 1-1.5" />
                        </svg>
                    </button>
                    <button type="button"
                        className={`btn btn-primary m-2 ${this.state.selectedMood === 'Happy' ? 'btn-secondary' : ''}`}
                        onClick={() => this.handleMoodSelection('Happy')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-emoji-smile" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                        </svg>
                    </button> */}
                    <div>How did you feel overall today?</div>
                    {this.state.moods.length === 0 ? (
                        <p>Loading moods...</p>
                    ) : (
                        this.state.moods.map(mood => (
                            <button
                                key={mood.mood_id}
                                type="button"
                                className={`btn btn-primary m-2 ${this.state.selectedMood === mood.mood_name ? 'btn-secondary' : ''}`}
                                onClick={() => this.handleMoodSelection(mood)}
                            >
                                {mood.mood_name}
                            </button>
                        ))
                    )}

                    <div>How many minutes of exercise did you complete today?</div>
                    <input
                        type="number"
                        name="exercise_duration"
                        value={this.state.selectedExerciseDuration}
                        onChange={this.handleExerciseDurationChange}
                    />
                    <div>How many hours of sleep did you get last night?</div>
                    <input
                        type="number"
                        name="sleep_duration"
                        value={this.state.selectedSleepDuration}
                        onChange={this.handleSleepDurationChange}
                    />
                    <div>Did you complete a non-physical social activity today?</div>
                    <button type="button"
                        className={`btn btn-primary m-2 ${this.state.selectedSocialisation === true ? 'btn-secondary' : ''}`}
                        onClick={() => this.handleSocialisationChange(true)}>
                        Yes
                    </button>
                    <button type="button"
                        className={`btn btn-primary m-2 ${this.state.selectedSocialisation === false ? 'btn-secondary' : ''}`}
                        onClick={() => this.handleSocialisationChange(false)}
                    >
                        No
                    </button>
                    {/* will need to add in database/api for productivity - ignore for now! */}
                    <div>Did you feel productive today?</div>
                    <button type="button" className="btn btn-primary m-2">
                        Not at all.
                    </button>
                    <button type="button" className="btn btn-primary m-2">
                        I tried..
                    </button>
                    <button type="button" className="btn btn-primary m-2">
                        Super Productive!
                    </button>
                    <button type="button" className="btn btn-primary m-2">
                        Somewhat
                    </button>

                    <div>
                        <button type="button" className="btn btn-success m-2" onClick={() => this.handleSubmit()}>
                            Submit
                        </button>
                    </div>
                </form>

            </div>
        )
    }
}
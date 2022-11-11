import React, { useState, useEffect } from "react";
import Hamburger from "../Hamburger/Hamburger"
import Settings from "../Settings/Settings"

function Main({
    handleHamburgerClose,
    handleSetingsClose,
    isHamburgerOpen,
    isSettingsOpen,
    minSettings,
    setMinSettings,
    handleSubmitSettings,
}) {
    const DEFAULT_WORK_INTERVAL = 25*60;
    const DEFAULT_RELAX_INTERVAL = 5*60;
    
    const [isTimerActive, setTimerActive] = useState(false);
    const [isTimerStarted, setTimerStarted] = useState(false);
    const [startTime, setStartTime] = useState(DEFAULT_WORK_INTERVAL);
    const [defaultStartTime, setDefaultStartTime] = useState(DEFAULT_WORK_INTERVAL)
    const [stopTimer, setStopTimer] = useState(null);
    const [titleText, setTitleText] = useState('Let`s Start Working!')
    const [relaxTimerMode, setRelaxTimerMode] = useState(false);

    const minutes = Math.floor(defaultStartTime / 60);
    const seconds = defaultStartTime % 60;
    const defaultMinutes = minutes < 10 ? minutes < 1 ? '00' : '0'+minutes : minutes;
    const defaultSeconds = seconds < 10 ? '0'+seconds : seconds;
    const [timerCountdown, setTimerCountdown] = useState(defaultMinutes+' : '+defaultSeconds);
    
    const classNameStartPause = `main__buttons-button main__buttons-button_play ${isTimerActive && 'main__buttons-button_pause'}`;
    const classNameForward = `main__buttons-button main__buttons-button_forward ${isTimerStarted && 'main__buttons-button_active'}`;
    const classNameStopReset = `main__buttons-button main__buttons-button_stop ${isTimerStarted && 'main__buttons-button_active'}`;

    function preDefaultMinutes(data) {
        const minutes = Math.floor(data / 60);
        return minutes < 10 ? minutes < 1 ? '00' : '0'+minutes : minutes;
    }

    function preDefaultSeconds(data) {
        const seconds = data % 60;
        return seconds < 10 ? '0'+seconds : seconds;
    }

    useEffect(() => {
        relaxTimerMode ? setDefaultStartTime(DEFAULT_RELAX_INTERVAL) : setDefaultStartTime(DEFAULT_WORK_INTERVAL);
      }, [relaxTimerMode, DEFAULT_RELAX_INTERVAL, DEFAULT_WORK_INTERVAL]);

    function startTimer(startTime) {
        if (stopTimer) {
            return;
        }
        let time = startTime;
        let min = parseInt(time / 60);
        if ( min < 1 ) min = 0;
            time = parseInt(time - min * 60);
        if ( min < 10 ) min = '0'+min;
        let seconds = time;
        if ( seconds < 10 ) seconds = '0'+seconds;
        setTimerCountdown(min+' : '+seconds);
        startTime--;
        setStartTime(startTime);
        if (startTime >= 0) { 
            setStopTimer(setTimeout(() => startTimer(startTime), 1000))
        } else {
            handleNextTimer();
        }
    }

    function stopCountdown() {
        clearTimeout(stopTimer);
        setStopTimer(null);
    }

    function handleStartTimer() {
        !isTimerActive ? setTimerActive(true) : setTimerActive(false);
        setTimerStarted(true);
        !isTimerActive ? startTimer(startTime) : stopCountdown();
        !isTimerActive ? !relaxTimerMode ? setTitleText('Working Hard...') : setTitleText('Relaxing...') : setTitleText('Pausing...');
    }

    function handleResetTimer() {
        stopCountdown();
        setTimerActive(false);
        setTimerStarted(false);
        setStopTimer(null);
        setTimerCountdown(defaultMinutes+' : '+defaultSeconds);
        relaxTimerMode ? setStartTime(DEFAULT_RELAX_INTERVAL) : setStartTime(DEFAULT_WORK_INTERVAL);
        relaxTimerMode ? setTitleText('Let`s Relax a Littlebit!')  : setTitleText('Let`s Start Working!');
    }

    function handleNextTimer() {
        stopCountdown();
        setTimerActive(false);
        setTimerStarted(false);
        setStopTimer(null);
        !relaxTimerMode ? setTimerCountdown(preDefaultMinutes(DEFAULT_RELAX_INTERVAL)+' : '+preDefaultSeconds(DEFAULT_RELAX_INTERVAL)) : setTimerCountdown(preDefaultMinutes(DEFAULT_WORK_INTERVAL)+' : '+preDefaultSeconds(DEFAULT_WORK_INTERVAL));
        !relaxTimerMode ? setRelaxTimerMode(true) : setRelaxTimerMode(false);
        !relaxTimerMode ? setStartTime(DEFAULT_RELAX_INTERVAL) : setStartTime(DEFAULT_WORK_INTERVAL);
        !relaxTimerMode ? setTitleText('Let`s Relax a Littlebit!') : setTitleText('Let`s Start Working!');
    }

    function switchToWorkTimer() {
        stopCountdown();
        setTimerActive(false);
        setTimerStarted(false);
        setStopTimer(null);
        setRelaxTimerMode(false);
        setStartTime(DEFAULT_WORK_INTERVAL);
        setTimerCountdown(preDefaultMinutes(DEFAULT_WORK_INTERVAL)+' : '+preDefaultSeconds(DEFAULT_WORK_INTERVAL));
        setTitleText('Let`s Start Working!');
        handleHamburgerClose();
    }
  
    function switchToRelaxTimer() {
        stopCountdown();
        setTimerActive(false);
        setTimerStarted(false);
        setStopTimer(null);
        setRelaxTimerMode(true);
        setStartTime(DEFAULT_RELAX_INTERVAL);
        setTimerCountdown(preDefaultMinutes(DEFAULT_RELAX_INTERVAL)+' : '+preDefaultSeconds(DEFAULT_RELAX_INTERVAL));
        setTitleText('Let`s Relax a Littlebit!');
        handleHamburgerClose();
    }
    
    return (
        <>
            <main className="main">
                <h1 className="main__title">{titleText}</h1>
                <div className="main__pomodoro-image">
                    <p className="main__timer">{timerCountdown}</p>
                </div>
                <div className="main__buttons">
                    <button className={classNameForward} type="button" onClick={handleNextTimer}></button>
                    <button className={classNameStartPause} type="button" onClick={handleStartTimer}></button>
                    <button className={classNameStopReset} type="button" onClick={handleResetTimer}></button>
                </div>
            </main>
            <Hamburger 
            isOpen={isHamburgerOpen}
            onClose={handleHamburgerClose}
            switchToWorkTimer={switchToWorkTimer}
            switchToRelaxTimer={switchToRelaxTimer}
            />
            <Settings 
            isSettingsOpen={isSettingsOpen}
            handleSetingsClose={handleSetingsClose}
            minSettings={minSettings}
            setMinSettings={setMinSettings}
            handleSubmitSettings={handleSubmitSettings}
            />
        </>
    );
}
export default Main;
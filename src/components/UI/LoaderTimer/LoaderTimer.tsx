import React from "react";
import './LoaderTimer.scss'
import LoaderCircle from "../LoaderCircle/LoaderCircle";

type Props = {
    seconds: number,
    active: boolean,
    hideTimer(): void
}

type State = {
    isShowTimer: boolean,
    seconds: number
}

class LoaderTimer extends React.Component<Props, State> {
    timer: number | undefined | null

    constructor(props: Props) {
        super(props);
        this.timer = null;

        this.startTimer = this.startTimer.bind(this)
        this.clearTimer = this.clearTimer.bind(this)
    }

    state = {
        isShowTimer: false,
        seconds: this.props.seconds,
    }

    componentWillUnmount() {
        if (this.timer) this.clearTimer();
    }

    componentDidUpdate() {
        if (this.props.active) {
            this.startTimer()
        }
    }

    startTimer() {
        if (!this.timer) {
            this.timer = window.setInterval(() => {
                const count = this.state.seconds - 1
                this.setState({seconds: count})
                this.setState({isShowTimer: true})
                if (this.state.seconds < 1) {
                    this.clearTimer()
                }
            }, 1000)
        }
    }

    clearTimer() {
        if (this.timer) {
            window.clearInterval(this.timer)
            this.timer = null;
            this.props.hideTimer()
            this.setState({isShowTimer: false})
            this.setState({seconds: this.props.seconds})
        }
    }


    render() {
        return (
            <div className={'LoaderTimer' + (this.props.active ? ' LoaderTimer_active' : '')}>
                {
                    this.props.active &&
                    <>
                      <p className="LoaderTimer__timer">{this.state.seconds}</p>
                      <LoaderCircle/>
                    </>
                }
            </div>
        )
    }
}

export default LoaderTimer
import { Component } from "react";
import TokenInputForm from "../components/TokenInputForm";

class Home extends Component {
    render() {
        return (
            <div className="body">
                <div className="welcome-title">
                    <h1>Welcome to Leon's NAS</h1>
                </div>
                <TokenInputForm />
            </div>
        );
    }
}

export default Home
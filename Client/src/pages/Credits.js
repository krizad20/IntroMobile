import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Credits() {
    return (
        <div id="outer-container">
            <div id="page-wrap">
                <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
                <div className="head">
                    <center className="head__title">
                        <h1>Credits</h1>
                    </center>
                </div>
                <div className="body">
                    <center className="body__content">
                        <br /><br />
                        <h2>6234401623 กฤษฎา อินทะสอน</h2><br />
                        <h2>6234406823 กิตติภพ ด้วงช้าง</h2><br />
                        <h2>6234424023 ธนดล สิทธานนท์</h2>
                    </center>

                </div>
            </div>
        </div>

    )
}
